import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Model from '../Model';
import { SIZE } from '../../constants';
import { useEffect, useRef } from 'react';

function MeshViewer({ file }) {
    const glRef = useRef()
    useEffect(() => {
        return () => {
            const renderer = glRef.current
            console.log("daozhele");

            if (renderer) {
                renderer.forceContextLoss();

                // 2. 清理 three.js 资源
                renderer.dispose();

                // 3. 避免悬挂引用
                glRef.current = null;
            }
        }
    }, [])
    return (
        <div style={{ width: SIZE.TABLE_ROW_WIDTH, height: SIZE.TABLE_ROW_HEIGHT }}>
            <Canvas
                onCreated={({ gl }) => {
                    glRef.current = gl
                }}
                camera={{ position: [0, 0, 3], fov: 45 }}
            >
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 10]} intensity={0.5} />
                <Model url={file} />
                <OrbitControls enableDamping enableZoom={true} />
            </Canvas>
        </div>
    );
}

export default MeshViewer;  