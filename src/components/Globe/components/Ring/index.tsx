import { useEffect, useRef } from 'react';
import { Billboard, useTexture } from '@react-three/drei';
import * as THREE from 'three';

import { useFrame } from '@react-three/fiber';

const Ring = () => {
  const meshRef = useRef<THREE.Mesh>();
  const ringBgRef = useRef<THREE.Mesh>();

  const texture = useTexture('/merry_christmas.png');

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.offset.setY(0);
  texture.repeat.set(3, 1.0);
  texture.minFilter = THREE.NearestFilter;

  useEffect(() => {
    if (meshRef.current && ringBgRef.current) {
      meshRef.current.rotation.z = 0.3;
      ringBgRef.current.rotation.z = 0.3;
    }
  }, [meshRef, ringBgRef]);

  useFrame((state, delta) => {
    texture.offset.setX(texture.offset.x + delta * 0.03, 0.1);
  });

  return (
    <>
      <Billboard
        {...({} as any)}
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <mesh ref={meshRef}>
          <cylinderBufferGeometry args={[720, 720, 100, 32 * 4, 1, true]} />
          <meshBasicMaterial
            side={THREE.DoubleSide}
            map={texture}
            alphaTest={0.5}
            transparent
          />
        </mesh>

        <mesh ref={ringBgRef}>
          <cylinderBufferGeometry args={[719, 719, 100, 32 * 4, 1, true]} />
          <meshBasicMaterial color="#131b35" transparent opacity={0.5} />
        </mesh>
      </Billboard>
    </>
  );
};

export default Ring;
