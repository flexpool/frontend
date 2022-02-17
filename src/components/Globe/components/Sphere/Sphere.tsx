import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';
import { useStore } from '../../store';
import { radian2Degree, geo2CanvasXY, getRegionFromColor } from '../../utils';

const CANVAS_HEIGHT = 500 / 2;
const CANVAS_WIDTH = CANVAS_HEIGHT * 2;

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

const Sphere = ({ worldmap }: any) => {
  const { fresnel_color } = useControls({
    fresnel_color: '#20196f',
  });

  const getPixelData = (x, y) => {
    const i = Math.floor(y - 1) * CANVAS_WIDTH * 4 + Math.floor(x) * 4;
    return [worldmap[i], worldmap[i + 1], worldmap[i + 2], worldmap[i + 3]];
  };

  const sphereRef = useRef<THREE.Mesh>(null);
  const raycasterRef = useRef<THREE.Raycaster>();
  const mousePos = useRef<{
    x: number;
    y: number;
    realX: number;
    realY: number;
  } | null>(null);

  useEffect(() => {
    if (sphereRef.current) {
      sphereRef.current.material.uniforms.fresnel_color.value = new THREE.Color(
        fresnel_color
      );
    }
  }, [fresnel_color]);

  const { size, camera } = useThree();

  const getTheta = (x, y) => {
    const theta = radian2Degree(Math.atan(y / x));

    // x is z y is x

    if (x < 0 && y > 0) {
      return 90 + theta + 90;
    }

    if (x < 0 && y < 0) {
      return 180 + theta;
    }

    if (x > 0 && y < 0) {
      return 270 + 90 + theta;
    }

    return theta;
  };

  const getPhi = (x, y, z) => {
    const phi = radian2Degree(Math.atan(Math.sqrt(x * x + y * y) / z));
    if (phi < 0) {
      return 90 + (90 + phi);
    }
    return phi;
  };

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

          const pos = geo2CanvasXY(
            getPhi(z, x, y) - 90,
            getTheta(z, x) - 180,
            CANVAS_HEIGHT,
            CANVAS_WIDTH
          );
          const pixel = getPixelData(pos.x, pos.y);

          const [r, g, b] = pixel;

          if (r === 0 && g === 0 && b === 0) setRegion(null);

          // setRegion(getRegionFromColor(r, g, b));
        }
      }
    }
  });

  return (
    <>
      <mesh
        ref={sphereRef}
        position={[0, 0, 0]}
        onPointerMove={(event: any) => {
          const x = (event.offsetX / size.width) * 2 - 1;
          const y = -(event.offsetY / size.height) * 2 + 1;

          mousePos.current = {
            x: x,
            y: y,
            realX: event.offsetX,
            realY: event.offsetY,
          };
        }}
        onPointerLeave={() => {
          mousePos.current = null;
        }}
      >
        <sphereGeometry attach="geometry" args={[600, 32 * 2, 32 * 2]} />
        <shaderMaterial transparent attach="material" args={[MyFirstShader]} />
      </mesh>
      <raycaster ref={raycasterRef} />
    </>
  );
};

export default Sphere;
