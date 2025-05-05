import React, { useState, useEffect, useMemo } from 'react';
import MeshViewer from './components/MeshViewer';

function App() {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    fetch('/assets/mesh_list.json')
      .then(res => {
        return res.json()
      })
      .then(data => setFolders(data));
  }, []);

  const maxCols = useMemo(() => {
    if (!folders.length) return 0;
    return Math.max(...folders.map(f => f.files.length));
  }, [folders]);

  const containerStyle = {
    overflow: 'auto',
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
  };
  const tableStyle = {
    borderCollapse: 'collapse',
    marginTop: '200px'
  };
  const thStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    fontSize: '18px',
    color: '#333366'
  };
  const cellStyle = {
    height: '300px',
    border: '1px solid #ccc'
  };

  return (
    <div style={containerStyle}>
      <div>
        <h1>SharpVoxel User Study</h1>
      </div>
      <table style={tableStyle}>
        <tbody>
          {folders.map(folder => (
            <tr key={folder.folder}>
              <th style={thStyle}>{folder.folder}</th>
              {Array.from({ length: maxCols }).map((_, i) => (
                <td key={i} style={cellStyle}>
                  {folder.files[i] && (
                    <MeshViewer folder={folder.folder} file={folder.files[i]} />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
