import * as THREE from 'three';
import React, { useMemo } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FileLoader } from 'three';

function parseOFF(text) {
    const lines = text.trim().split('\n').map(l => l.trim());
    if (lines[0] !== 'OFF') throw new Error('Not a valid OFF file');
    const [numV, numF] = lines[1].split(' ').map(Number);

    const vertices = [];
    for (let i = 0; i < numV; i++) {
        const [x, y, z] = lines[2 + i].split(' ').map(Number);
        vertices.push(x, y, z);
    }

    const indices = [];
    for (let i = 0; i < numF; i++) {
        const parts = lines[2 + numV + i].split(' ').map(Number);
        const n = parts[0], vs = parts.slice(1, 1 + n);
        if (n === 3) {
            indices.push(...vs);
        } else {
            for (let k = 1; k < n - 1; k++) {
                indices.push(vs[0], vs[k], vs[k + 1]);
            }
        }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
}


function MeshModel({ geometry }) {
    const group = useMemo(() => new THREE.Group(), []);
    React.useLayoutEffect(() => {
        if (!geometry) return;
        const mesh = new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        // 更新矩阵、计算包围盒
        mesh.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(mesh);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const scaleFactor = 1.2 / Math.max(size.x, size.y, size.z);

        // 居中 & 缩放
        mesh.position.sub(center);
        group.clear();
        group.add(mesh);
        group.scale.setScalar(scaleFactor);
    }, [geometry, group]);

    // useFrame(() => {
    //     group.rotation.y += 0.01;
    // });

    return <primitive object={group} />;
}
export default function VoxModel({ url }) {
    const ext = url.split('.').pop().toLowerCase();

    if (ext === 'off') {
        const text = useLoader(FileLoader, url, loader => loader.setResponseType('text'));
        const geometry = useMemo(() => parseOFF(text), [text]);
        return <MeshModel geometry={geometry} />;
    } else {
        return <></>;
    }
}
