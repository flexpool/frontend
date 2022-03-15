import React, { useEffect, useRef, useMemo } from 'react';
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { degree2Radian } from '../../utils';

import expandVertexShader from '../../shaders/expand/vertex.glsl';
import expandFragmentShader from '../../shaders/expand/fragment.glsl';

const Marker = ({
  lat,
  long,
  color = '#008cff',
}: {
  lat: number;
  long: number;
  color: string;
}) => {
  const { frequency, speed, p_color } = useControls({
    p_color: color,
    frequency: {
      value: 5,
      min: 0,
      max: 10,
      step: 1,
    },
    speed: {
      min: 0,
      max: 10,
      value: 5,
      step: 1,
    },
  });

  const MarkerShader = React.useMemo(
    () => ({
      uniforms: {
        u_time: {
          value: 0,
        },
        u_color: {
          value: new THREE.Color(color),
        },
        u_frequency: {
          value: 5.0,
        },
        u_speed: {
          value: 5.0,
        },
      },
      vertexShader: expandVertexShader,
      fragmentShader: expandFragmentShader,
    }),
    [color]
  );

  useFrame(({ clock }) => {
    if (testShaderMaterialRef.current) {
      testShaderMaterialRef.current.uniforms.u_time.value = clock.elapsedTime;
    }
  });

  const markerGroupRef = useRef<THREE.Group>();
  const testShaderMaterialRef = useRef<THREE.ShaderMaterial>();

  useEffect(() => {
    if (testShaderMaterialRef.current) {
      // testShaderMaterialRef.current.uniforms.u_color.value = new THREE.Color(
      //   p_color
      // );

      testShaderMaterialRef.current.uniforms.u_frequency.value = frequency;

      testShaderMaterialRef.current.uniforms.u_speed.value = speed;
    }

    if (markerGroupRef.current) {
      markerGroupRef.current.lookAt(new THREE.Vector3(0, 0, 0));
    }
  }, [testShaderMaterialRef, p_color, frequency, speed, markerGroupRef]);

  useFrame(({ clock }) => {
    if (testShaderMaterialRef.current) {
      testShaderMaterialRef.current.uniforms.u_time.value = clock.elapsedTime;
    }
  });

  return (
    <group
      position={new THREE.Vector3().setFromSphericalCoords(
        602,
        degree2Radian(90 - lat),
        degree2Radian(long + 180)
      )}
      scale={[38, 38, 38]}
      ref={markerGroupRef}
    >
      <mesh>
        <planeBufferGeometry attach="geometry" args={[1, 1, 32 * 3, 32 * 3]} />
        <shaderMaterial
          transparent
          side={THREE.DoubleSide}
          ref={testShaderMaterialRef}
          attach="material"
          args={[MarkerShader]}
        />
      </mesh>
    </group>
  );
};

export default Marker;
