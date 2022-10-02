import React, { useRef, useEffect } from 'react';
import { useThree, useFrame, useLoader } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';
import { useStore } from '../../store';
import { getRegionFromColor } from '../../utils';

import vertexShader from './shader/vertex.glsl';
import fragmentShader from './shader/fragment.glsl';
import { useWorldMapCanvasContext } from '../../providers/WorldMapCanvasProvider';

const FresnelShader = {
  uniforms: {
    fresnel_color: {
      value: new THREE.Color('#20196f'),
    },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
};

const Sphere = () => {
  const { getCartesianPixelData } = useWorldMapCanvasContext();

  const { fresnel_color } = useControls({
    fresnel_color: '#c0c5d4',
  });

  const matcap = useLoader(THREE.TextureLoader, 'matcap11.png');

  const sphereRef = useRef<THREE.Mesh>(null);
  const raycasterRef = useRef<THREE.Raycaster>();
  const mousePos = useRef<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (sphereRef.current) {
      sphereRef.current.material.uniforms.fresnel_color.value = new THREE.Color(
        fresnel_color
      );
    }
  }, [fresnel_color]);

  const { size, camera } = useThree();

  const setRegion = useStore((state) => state.setRegion);

  const frame = useRef(0);

  useFrame(() => {
    frame.current += 1;

    if (frame.current % 4 === 0) {
      if (raycasterRef.current && mousePos.current) {
        raycasterRef.current.setFromCamera(
          { x: mousePos.current.x, y: mousePos.current.y },
          camera
        );
        const intersect = raycasterRef.current.intersectObjects([
          sphereRef.current,
        ]);
        if (intersect.length) {
          const { x, y, z } = intersect[0].point;

          const pixel = getCartesianPixelData(x, y, z);

          const [r, g, b] = pixel;

          if (r === 0 && g === 0 && b === 0) setRegion(null);

          setRegion(getRegionFromColor(r, g, b));
        }
      }
    }
  });

  return (
    <>
      <mesh>
        <sphereGeometry attach="geometry" args={[600, 32 * 2, 32 * 2]} />
        <meshMatcapMaterial transparent attach="material" matcap={matcap} />
      </mesh>
      <mesh
        ref={sphereRef}
        position={[0, 0, 0]}
        onPointerMove={(event: any) => {
          const x = (event.offsetX / size.width) * 2 - 1;
          const y = -(event.offsetY / size.height) * 2 + 1;

          mousePos.current = {
            x: x,
            y: y,
          };
        }}
        onPointerLeave={() => {
          mousePos.current = null;
          setRegion(null);
        }}
        onPointerOut={() => {
          mousePos.current = null;
          setRegion(null);
        }}
        onWheel={() => {
          mousePos.current = null;
          setRegion(null);
        }}
      >
        <sphereGeometry attach="geometry" args={[600.3, 32 * 2, 32 * 2]} />
        <shaderMaterial
          transparent
          blending={2}
          attach="material"
          args={[FresnelShader]}
        />
      </mesh>

      <raycaster ref={raycasterRef} />
    </>
  );
};

export default Sphere;
