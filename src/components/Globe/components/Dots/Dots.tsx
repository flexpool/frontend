import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { degree2Radian, getRegionFromColor } from '../../utils';
import { useWorldMapCanvasContext } from '../../providers/WorldMapCanvasProvider';
import { useStore } from '../../store';

import fragmentShader from './shader/fragment.glsl';
import vertexShader from './shader/vertex.glsl';

const Shader = {
  uniforms: {},
  vertexShader,
  fragmentShader,
};

const COUNT = 21430;

const geometry = new THREE.CircleBufferGeometry(2, 5);

const REGION_COLOR = {
  na: '#00ffee',
  sa: '#00ffee',
  eu: '#00ffee',
  ap: '#00ffee',
  au: '#00ffee',
  af: '#00ffee',
  ru: '#00ffee',
  me: '#00ffee',
  'n/a': '#a1a4b1',
};

const Dots = () => {
  const selectedRegion = useStore((state) => state.region);

  const { getGeoPixelData } = useWorldMapCanvasContext();

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

          const pixel = getGeoPixelData(lat, long);

          if (pixel[3] > 0) {
            vector.setFromSphericalCoords(602, latR, longR);

            temp.position.set(vector.x, vector.y, vector.z);

            temp.lookAt(center);
            temp.updateMatrix();
            ref.current.setMatrixAt(i, temp.matrix);

            const [r, g, b] = pixel;

            let region = getRegionFromColor(r, g, b) || 'n/a';

            if (region === selectedRegion) {
              ref.current.setColorAt(i, color.set(REGION_COLOR[region]));
            } else {
              ref.current.setColorAt(i, color.set('#a1a4b1'));
            }

            i++;
          }
        }
      }

      // Update the instance
      ref.current.instanceColor.needsUpdate = true;
      ref.current.instanceMatrix.needsUpdate = true;
    }
  }, [ref, selectedRegion, getGeoPixelData]);

  return (
    <instancedMesh ref={ref} args={[geometry, null, COUNT]}>
      <shaderMaterial
        attach="material"
        transparent
        side={THREE.BackSide}
        args={[Shader]}
      />
    </instancedMesh>
  );
};

export default Dots;
