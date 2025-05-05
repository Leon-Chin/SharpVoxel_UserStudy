import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Model from '../Model';

function MeshViewer({ folder, file }) {
    const path = `/assets/data/${folder}/${file}`;
    return (
        <div style={{ width: 200, height: 200 }}>
            <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 10]} intensity={0.5} />
                <Model url={path} />
                <OrbitControls enableDamping enableZoom={false} />
            </Canvas>
        </div>
    );
}

export default MeshViewer;  