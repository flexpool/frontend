import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';

import vertexShader from './shader/vertex.glsl';
import fragmentShader from './shader/fragment.glsl';

const MyFirstShader = {
  uniforms: {
    fresnel_color: {
      value: new THREE.Color('#20196f'),
    },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
};

const Sphere = () => {
  const { fresnel_color } = useControls({
    fresnel_color: '#20196f',
  });

  const sphereRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (sphereRef.current) {
      sphereRef.current.material.uniforms.fresnel_color.value = new THREE.Color(
        fresnel_color
      );
    }
  }, [fresnel_color]);

  // Remove this will cause rendering issues
  useThree();

  return (
    <>
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry attach="geometry" args={[600, 32 * 2, 32 * 2]} />
        <shaderMaterial transparent attach="material" args={[MyFirstShader]} />
      </mesh>
    </>
  );
};

export default Sphere;
