import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { geoInterpolate } from 'd3-geo';
import { useControls } from 'leva';
import * as THREE from 'three';
import { degree2Radian } from '../../utils';

const toXYZ = (radius, lat, long) => {
  return new THREE.Vector3().setFromSphericalCoords(
    radius,
    degree2Radian(90 - lat),
    degree2Radian(long + 180)
  );
};

type ArcProps = {
  fromLatitude: number;
  fromLongitude: number;
  toLatitude: number;
  toLongitude: number;
};

const Arc = ({
  fromLatitude,
  fromLongitude,
  toLatitude,
  toLongitude,
}: ArcProps) => {
  const groupRef = useRef<THREE.Group>();
  const tubeRef = useRef<THREE.Mesh>();
  const tube2Ref = useRef<THREE.Mesh>();

  const { height, color } = useControls({
    color: '#de4fcb',
    height: {
      value: 500,
      max: 1200,
      min: 0,
      step: 10,
    },
  });

  const geo1 = [fromLongitude, fromLatitude];
  const geo2 = [toLongitude, toLatitude];

  let start = toXYZ(600, geo1[1], geo1[0]);
  let end = toXYZ(600, geo2[1], geo2[0]);

  const arcHeight = start.distanceTo(end) * 0.5 + height;

  // Longitude, Latitude
  const i = geoInterpolate(geo1, geo2);

  const control1 = toXYZ(arcHeight, i(0.25)[1], i(0.25)[0]);
  const control2 = toXYZ(arcHeight, i(0.75)[1], i(0.75)[0]);

  const curve = new THREE.CubicBezierCurve3(start, control1, control2, end);
  const curve2 = new THREE.CubicBezierCurve3(end, control2, control1, start);

  // extremely simple state machine: forward, wait, reverse
  const state = useRef('forward');
  const wait = useRef(Math.floor(Math.random() * 4) + 1);

  useFrame(({ clock }, delta) => {
    if (tubeRef.current && tube2Ref.current) {
      const forwardArcProgress = tubeRef.current.geometry.drawRange;
      const reverseArcProgress = tube2Ref.current.geometry.drawRange;
      const target = tubeRef.current.geometry.index.count;
      const velocity = (target / 2) * delta;

      switch (state.current) {
        case 'forward': {
          if (forwardArcProgress.count >= target) {
            state.current = 'wait';
          }
          break;
        }
        case 'wait': {
          wait.current -= delta;

          if (wait.current <= 0) {
            wait.current = Math.floor(Math.random() * 4) + 1;
            reverseArcProgress.count = target;
            state.current = 'reverse';
          }
          break;
        }
        case 'reverse': {
          if (reverseArcProgress.count <= 0) {
            state.current = 'done';
          }
          break;
        }
      }

      if (state.current === 'forward') {
        tubeRef.current.geometry.drawRange.count += velocity;
        tube2Ref.current.geometry.drawRange.count = 0;
      }

      if (state.current === 'reverse') {
        tubeRef.current.geometry.drawRange.count = 0;
        tube2Ref.current.geometry.drawRange.count -= velocity;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]} ref={tubeRef}>
        <tubeBufferGeometry
          attach="geometry"
          args={[curve, 100, 1.4, 20, false]}
          drawRange={{ start: 0, count: 1 }}
        />

        <meshStandardMaterial
          transparent
          attach="material"
          color={color}
          side={THREE.DoubleSide}
          opacity={1}
        />
      </mesh>

      <mesh position={[0, 0, 0]} ref={tube2Ref}>
        <tubeBufferGeometry
          attach="geometry"
          args={[curve2, 100, 1.4, 20, false]}
          drawRange={{ start: 0, count: 1 }}
        />

        <meshStandardMaterial
          transparent
          attach="material"
          color={color}
          side={THREE.DoubleSide}
          opacity={1}
        />
      </mesh>
    </group>
  );
};

export default React.memo(Arc);
