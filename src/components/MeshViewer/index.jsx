import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SIZE } from '../../constants';
import { useEffect, useRef } from 'react';
import Model from '../Model';

function VoxelViewer({ file }) {
    const glRef = useRef()
    useEffect(() => {
        return () => {
            const renderer = glRef.current
            if (renderer) {
                renderer.forceContextLoss();
                renderer.dispose();
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

export default VoxelViewer;  