import * as THREE from 'three';
import React, { useMemo } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

function Model({ url }) {
    const original = useLoader(OBJLoader, url);
    const group = useMemo(() => new THREE.Group(), []);

    // Center, scale, and set material once loaded
    React.useLayoutEffect(() => {
        if (!original) return;
        const object = original.clone(true)

        // 2) 更新世界矩阵，保证 Box3 拿到的是最新的全局坐标
        object.updateMatrixWorld(true)

        // Create a group to hold the mesh
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 1.2 / maxDim;

        // Apply material and transform
        object.traverse(child => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
            }
        });
        object.position.sub(center)
        group.clear()
        group.add(object)
        group.scale.setScalar(scaleFactor)

    }, [original, group]);

    // Animate rotation
    useFrame(() => {
        group.rotation.y += 0.01;
    });

    return <primitive object={group} />;
}

export default Model;