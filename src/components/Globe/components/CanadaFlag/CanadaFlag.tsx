import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { degree2Radian } from '../../utils';

const flagPosition = new THREE.Vector3().setFromSphericalCoords(
  602,
  degree2Radian(90 - 49.246292),
  degree2Radian(-123.116226 + 180)
);

const CanadaFlag = () => {
  const flagTexture = useLoader(THREE.TextureLoader, './canada_flag.jpeg');
  flagTexture.minFilter = THREE.NearestFilter;
  flagTexture.generateMipmaps = false;

  return (
    <>
      <group position={flagPosition} scale={[5, 5, 5]} rotation-y={1.4}>
        <mesh position={[4, 5, 0]}>
          <planeBufferGeometry attach="geometry" args={[8, 4, 32, 32]} />
          <meshBasicMaterial
            attach="material"
            side={THREE.DoubleSide}
            transparent
            map={flagTexture}
          />
        </mesh>
        <mesh>
          <cylinderBufferGeometry attach="geometry" args={[0.2, 0.2, 14, 32]} />
          <meshPhongMaterial
            shininess={100}
            color={'#fe0100'}
            opacity={0.7}
            transparent
          />
        </mesh>
      </group>
    </>
  );
};

export default CanadaFlag;
