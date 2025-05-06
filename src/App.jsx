import React, { useState, useEffect, useMemo } from 'react';
import MeshViewer from './components/MeshViewer';
import BriefIntroduction from './components/BriefIntroduction';
import { Button, Divider, Form, Pagination, Progress, Radio, Result } from 'antd';
import { rules } from 'eslint-plugin-react-refresh';
import { SIZE } from './constants';
import { useDispatch, useSelector } from 'react-redux';
import { addAnswer, resetAnswers } from './redux/answerSlice';
import { SmileOutlined } from '@ant-design/icons';
import { moveToNextPhase, restart } from './redux/statusSlice';

const tableStyle = {
  borderCollapse: 'collapse',
  margin: "20px 0"
};
const thStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  fontSize: '18px',
  color: '#333366'
};
const cellStyle = {
  // height: '300px',
  border: '1px solid #ccc',
};

const selectCellStyle = {
  height: SIZE.TABLE_ROW_HEIGHT,
  width: '200px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '0px solid #ccc'
};

const selectedCellStyle = {
  border: '1px solid #ccc',
  backgroundColor: '#3875f7',
  // outline: '5px solid #3875f7',
  // outlineOffset: '-5px' 
};

const MyDivider = ({ text }) => <div style={{ padding: "0 30px" }}>
  <Divider orientation='left' >{text}</Divider>
</div>

const TableRow = ({ item, currentComparedModel }) => {
  const { model_ID, models } = item
  const { answers } = useSelector(state => state.answers)

  const sharpVoxIsFirst = useMemo(() => Math.random() < 0.5, []);
  const [selectedModel, setSelectedModel] = useState(answers[model_ID] || null);
  const dispatch = useDispatch()
  return <tr key={model_ID}>
    {/* GT */}
    <td key={model_ID + "vox"} style={cellStyle}>
      <MeshViewer file={models.sharpVox} />
    </td>

    {/*  Comparison */}
    {sharpVoxIsFirst ? <>
      <td key={model_ID + "sharpVox"} style={(selectedModel === "sharpVox" || selectedModel === "Both") ? selectedCellStyle : cellStyle}>
        <MeshViewer file={models.sharpVox} />
      </td>
      <td key={model_ID + currentComparedModel} style={(selectedModel === currentComparedModel || selectedModel === "Both") ? selectedCellStyle : cellStyle}>
        <MeshViewer file={models[currentComparedModel]} />
      </td>
    </> : <>
      <td key={model_ID + currentComparedModel} style={(selectedModel === currentComparedModel || selectedModel === "Both") ? selectedCellStyle : cellStyle}>
        <MeshViewer file={models[currentComparedModel]} />
      </td>
      <td key={model_ID + "sharpVox"} style={(selectedModel === "sharpVox" || selectedModel === "Both") ? selectedCellStyle : cellStyle}>
        <MeshViewer file={models.sharpVox} />
      </td>
    </>}

    {/*  Selection */}
    <td key={model_ID + "_selection"} style={selectCellStyle}>
      <Radio.Group
        name={model_ID}
        defaultValue={selectedModel}
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', gap: SIZE.GAP }}
        onChange={({ target: { value } }) => {
          console.log(value);
          setSelectedModel(value)
          dispatch(addAnswer({ model_ID, value }))
        }}
        options={[
          { value: sharpVoxIsFirst ? "sharpVox" : currentComparedModel, label: 'First' },
          { value: sharpVoxIsFirst ? currentComparedModel : "sharpVox", label: 'Second' },
          { value: "Neither", label: 'Neither' },
          { value: "Both", label: 'Both' },
        ]}
      />
    </td>
  </tr>
}

const ComparisonSection = ({ models, currentComparedModel }) => {
  const [currentPageNum, setCurrentPageNum] = useState(1)
  const { answers } = useSelector(state => state.answers)
  const modelsIDArr = models.map(item => item.model_ID)
  const answeredNum = useMemo(() => { return Object.keys(answers).filter(item => modelsIDArr.includes(item)).length }, [answers, modelsIDArr])
  const percentage = useMemo(() => { return answeredNum / modelsIDArr.length * 100 }, [answeredNum, modelsIDArr.length])
  const subModels = useMemo(() => {
    if (models?.length && models?.length !== 0) {
      const subArr = models?.slice((currentPageNum - 1) * 3, currentPageNum * 3)
      return subArr
    } else {
      return []
    }
  }, [models, currentPageNum])
  const dispatch = useDispatch()

  return models && models.length !== 0 ? <div>
    <div style={{}}>
      <Progress percent={percentage} type="line" format={percent => `${answeredNum}/${models.length} answered`} />
    </div>
    {percentage !== 100 ? <><table style={tableStyle}>
      <tbody>
        <tr>
          <th style={thStyle}>Voxel Ground Truth</th>
          <th style={thStyle}>First Model</th>
          <th style={thStyle}>Second Model</th>
        </tr>
        {subModels.map(item => (
          <TableRow item={item} key={item.model_ID} currentComparedModel={currentComparedModel} />
        ))}
      </tbody>
    </table>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: SIZE.TABLE_ROW_WIDTH }}>
        {/* <Pagination simple defaultCurrent={2} total={50} /> */}
        {models?.length !== 0 && <Pagination defaultCurrent={currentPageNum} onChange={setCurrentPageNum} total={models.length} defaultPageSize={3} showTotal={total => `Total ${total} items`} showSizeChanger={false} />}
      </div></> : <div>
      <Result
        icon={<SmileOutlined />}
        title="Great, we have done this section!"
        extra={<Button type="primary" onClick={() => dispatch(moveToNextPhase())}>Next Section</Button>}
      />
    </div>}

  </div> : <></>
}

// final answers' structure: { model_ID: { sharpVox: [userID, userID, ...], NDC: [userID, userID, ...], Neither: [userID, userID, ...], Both: [userID, userID, ...]} }
function App() {
  const { answers } = useSelector(state => state.answers)
  // one person's answers format { model_ID: { sharpVox: 1, NDC: 0, Neither: 0, Both: 0} }
  // { model_ID: "sharpVox" }
  // { model_ID: "NDC" }
  // { model_ID: "Both" }

  const [modelsNDC, setModelsNDC] = useState([]);
  const [modelsNMC, setModelsNMC] = useState([]);
  const [modelsNMCLite, setModelsNMCLite] = useState([]);

  const [isReady, setIsReady] = useState({ NDC: false, NMC: false, NMCLite: false })

  useEffect(() => {
    fetch('/assets/comparisonNDC.json')
      .then(res => res.json())
      .then(data => {
        setModelsNDC(data)
        setIsReady(prev => ({ ...prev, NDC: true }))
      })
    fetch('/assets/comparisonNMC.json')
      .then(res => res.json())
      .then(data => {
        setModelsNMC(data)
        setIsReady(prev => ({ ...prev, NMC: true }))
      })
    fetch('/assets/comparisonNMCLite.json')
      .then(res => res.json())
      .then(data => {
        setModelsNMCLite(data)
        setIsReady(prev => ({ ...prev, NMCLite: true }))
      })
  }, []);

  const numberOfTotalModels = useMemo(() => {
    if (isReady.NDC && isReady.NMC && isReady.NMCLite) {
      return modelsNDC.length + modelsNMC.length + modelsNMCLite.length
    } else {
      return 0
    }
  }, [isReady])

  const numberOfComparison = useMemo(() => {
    if (modelsNDC.length === 0) {
      return 0
    } else {
      const numberOfComparison = Object.keys(modelsNDC[0].models).length - 1
      return numberOfComparison
    }
  }, [modelsNDC])
  const { currentPhase } = useSelector(state => state.status)
  console.log("currentPhase", currentPhase);
  const dispatch = useDispatch()
  const handleSubmit = () => {
    console.log(answers);
    console.log(Object.keys(answers));
    dispatch(moveToNextPhase())
  }

  const handleReFill = () => {
    dispatch(resetAnswers())
    dispatch(restart())
  }
  return (
    <div>
      <BriefIntroduction numberOfComparison={numberOfComparison} numberOfModels={numberOfTotalModels} />
      {/* NDC */}
      {currentPhase === "NDC" && <>
        <MyDivider text={"1st comparison"} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ComparisonSection models={modelsNDC} currentComparedModel={"NDC"} />
        </div>
      </>}
      {/* NMC */}
      {currentPhase === "NMC" && <>
        <MyDivider text={"2nd comparison"} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ComparisonSection models={modelsNMC} currentComparedModel={"NMC"} />
        </div>
      </>}
      {/* NMC_Lite */}
      {currentPhase === "NMCLite" && <>
        <MyDivider text={"3rd comparison"} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ComparisonSection models={modelsNMCLite} currentComparedModel={"NMC_Lite"} />
        </div>
      </>}
      {(currentPhase === "done" || currentPhase === "submited") && <>
        <Result
          status="success"
          title="Thanks for your answers!"
          extra={currentPhase !== "submited" ? [
            <Button type="primary" key="console" onClick={handleSubmit}>
              Submit
            </Button>
          ] : [<Button type="primary" key="console" onClick={handleReFill}>
            Fill one more
          </Button>]}
        />
      </>}
    </div>
  );
}





export default App;
