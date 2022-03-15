import React, { useEffect, useRef } from 'react';
import { useControls } from 'leva';
import * as THREE from 'three';

import vertexShader from '../../shaders/halo/vertex.glsl';
import fragmentShader from '../../shaders/halo/fragment.glsl';

const GlowShader = {
  uniforms: {
    u_haloDirection: {
      value: new THREE.Vector3(0.73, -0.6, 1.16),
    },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
};

const Glow = () => {
  const glowMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const { posX, posY, posZ } = useControls({
    posX: {
      min: -2.0,
      max: 3.0,
      step: 0.01,
      value: 1.4,
    },
    posY: {
      min: -2.0,
      max: 3.0,
      step: 0.01,
      value: -1.4,
    },
    posZ: {
      min: -2.0,
      max: 3.0,
      step: 0.01,
      value: 2.0,
    },
  });

  useEffect(() => {
    if (glowMaterialRef.current) {
      glowMaterialRef.current.uniforms.u_haloDirection.value =
        new THREE.Vector3(posX, posY, posZ);
    }
  }, [glowMaterialRef, posX, posY, posZ]);

  return (
    <mesh>
      <sphereBufferGeometry attach="geometry" args={[603, 32 * 4, 32 * 4]} />
      <shaderMaterial
        ref={glowMaterialRef}
        attach="material"
        depthWrite={false}
        args={[GlowShader]}
        blending={2}
        transparent
        // side={THREE.FrontSide}
      />
    </mesh>
  );
};

export default Glow;
