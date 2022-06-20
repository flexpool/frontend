import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { geoInterpolate } from 'd3-geo';
import { useControls } from 'leva';
import * as THREE from 'three';
import { degree2Radian } from '../../utils';

import vertexShader from './shader/vertex.glsl';
import fragmentShader from './shader/fragment.glsl';

import { SERVERS } from '../../constants';

const toXYZ = (radius, lat, long) => {
  return new THREE.Vector3().setFromSphericalCoords(
    radius,
    degree2Radian(90 - lat),
    degree2Radian(long + 180)
  );
};

const getRandomServerCoordinate = (): Coordinate => {
  let random = Math.floor(Math.random() * SERVERS.length);

  return {
    longitude: SERVERS[random].longitude,
    latitude: SERVERS[random].latitude,
  };
};

type Coordinate = { longitude: number; latitude: number };

const Arc = ({
  delay,
  initial,
}: {
  delay: number;
  initial: [Coordinate, Coordinate];
}) => {
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>();

  const arcShader = useMemo(() => {
    return {
      uniforms: {
        u_time: {
          value: 0,
        },
        u_forward_time: {
          value: 1.6,
        },
        u_wait_time: {
          value: 4.0 + Math.floor(Math.random() * 3) * 2,
        },
        u_retreat_time: {
          value: 1.6,
        },
      },
      vertexShader,
      fragmentShader,
    };
  }, []);

  const [coordinates, setCoordinates] =
    useState<[Coordinate, Coordinate]>(initial);

  const geometryRef = useRef<THREE.BufferGeometry>();

  const { height, color } = useControls({
    color: '#de4fcb',
    height: {
      value: 500,
      max: 1200,
      min: 0,
      step: 10,
    },
  });

  const curveM = useMemo(() => {
    const [from, to] = coordinates;

    const geo1 = [from.longitude, from.latitude];
    const geo2 = [to.longitude, to.latitude];

    let start = toXYZ(600, geo1[1], geo1[0]);
    let end = toXYZ(600, geo2[1], geo2[0]);

    const arcHeight = start.distanceTo(end) * 0.5 + height;

    // Longitude, Latitude
    const i = geoInterpolate(geo1, geo2);

    const control1 = toXYZ(arcHeight, i(0.25)[1], i(0.25)[0]);
    const control2 = toXYZ(arcHeight, i(0.75)[1], i(0.75)[0]);

    const curve = new THREE.CubicBezierCurve3(start, control1, control2, end);

    return curve;
  }, [coordinates, height]);

  useFrame(({ clock }, delta) => {
    if (shaderMaterialRef.current && clock.elapsedTime > 0.5 + delay) {
      shaderMaterialRef.current.uniforms.u_time.value += delta;

      const totalTime =
        shaderMaterialRef.current.uniforms.u_forward_time.value +
        shaderMaterialRef.current.uniforms.u_wait_time.value +
        shaderMaterialRef.current.uniforms.u_retreat_time.value;

      if (shaderMaterialRef.current.uniforms.u_time.value >= totalTime) {
        shaderMaterialRef.current.uniforms.u_time.value = 0;

        setCoordinates([
          getRandomServerCoordinate(),
          getRandomServerCoordinate(),
        ]);
      }
    }
  });

  return (
    <mesh position={[0, 0, 0]}>
      <tubeBufferGeometry
        attach="geometry"
        args={[curveM, 100, 1.4, 20, false]}
        ref={geometryRef}
      />
      <shaderMaterial
        ref={shaderMaterialRef}
        args={[arcShader]}
        transparent
        side={THREE.DoubleSide}
        attach="material"
      />
    </mesh>
  );
};

export default React.memo(Arc);
