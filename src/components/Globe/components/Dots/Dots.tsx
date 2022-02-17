import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { degree2Radian, geo2CanvasXY } from '../../utils';

const COUNT = 21430;
const CANVAS_HEIGHT = 500 / 2;
const CANVAS_WIDTH = CANVAS_HEIGHT * 2;

const geometry = new THREE.CircleBufferGeometry(2, 5);
const material = new THREE.MeshStandardMaterial();
material.metalness = 0;
material.roughness = 0;
material.side = THREE.BackSide;
material.transparent = true;

const Dots = ({ worldmap }) => {
  const getPixelData = useCallback(
    (x: number, y: number) => {
      const i = Math.floor(y - 1) * CANVAS_WIDTH * 4 + Math.floor(x) * 4;
      return [worldmap[i], worldmap[i + 1], worldmap[i + 2], worldmap[i + 3]];
    },
    [worldmap]
  );

  const ref = useRef<THREE.InstancedMesh>();

  useEffect(() => {
    if (ref.current) {
      let i = 0;
      const vector = new THREE.Vector3();
      const center = new Vector3(0, 0, 0);
      const color = new THREE.Color();
      const temp = new THREE.Object3D();

      for (let lat = -90; lat <= 90; lat += 180 / 200) {
        const radius = Math.cos(degree2Radian(Math.abs(lat))) * 602;
        const circumference = radius * Math.PI * 2;
        const dotsForLat = Math.ceil(circumference * 0.1);

        for (let dots = 1; dots <= dotsForLat; dots++) {
          const long = -180 + dots * (360 / dotsForLat);

          // Convert from lat/long to three.js sphere coordinates
          const latR = degree2Radian(lat + 90);
          const longR = degree2Radian(long + 180);

          const { x, y } = geo2CanvasXY(lat, long, CANVAS_HEIGHT, CANVAS_WIDTH);
          let pixel = getPixelData(x, y);

          if (pixel[3] > 0) {
            vector.setFromSphericalCoords(602, latR, longR);

            temp.position.set(vector.x, vector.y, vector.z);

            temp.lookAt(center);
            temp.updateMatrix();
            ref.current.setMatrixAt(i, temp.matrix);

            ref.current.setColorAt(i, color.set('#151b37'));

            i++;
          }
        }
      }

      // Update the instance
      ref.current.instanceColor.needsUpdate = true;
      ref.current.instanceMatrix.needsUpdate = true;
    }
  }, [ref, getPixelData]);

  return <instancedMesh ref={ref} args={[geometry, material, COUNT]} />;
};

export default Dots;
