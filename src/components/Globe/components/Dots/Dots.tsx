import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { degree2Radian, geo2CanvasXY, getRegionFromColor } from '../../utils';

const COUNT = 21430;
const CANVAS_HEIGHT = 500 / 2;
const CANVAS_WIDTH = CANVAS_HEIGHT * 2;

const geometry = new THREE.CircleBufferGeometry(2, 5);
const material = new THREE.MeshPhongMaterial();
material.shininess = 100;
material.side = THREE.BackSide;
material.transparent = true;

const Dots = ({ count = COUNT, temp = new THREE.Object3D(), worldmap }) => {
  // const mapTexture = useLoader(THREE.TextureLoader, '/map_new.png');
  // mapTexture.minFilter = THREE.NearestFilter;
  // mapTexture.magFilter = THREE.NearestFilter;
  // mapTexture.wrapS = THREE.RepeatWrapping;
  // mapTexture.wrapT = THREE.RepeatWrapping;

  // mapTexture.offset.x = -0.25;
  // mapTexture.repeat.set(1, 1);

  const getPixelData = (x, y) => {
    const i = Math.floor(y - 1) * CANVAS_WIDTH * 4 + Math.floor(x) * 4;
    return [worldmap[i], worldmap[i + 1], worldmap[i + 2], worldmap[i + 3]];
  };

  const { spcR, row, density } = useControls({
    spcR: {
      value: 600,
      min: 100,
      max: 1000,
      step: 0.1,
    },
    row: {
      value: 210,
      min: 100,
      max: 400,
      step: 1,
    },
    density: {
      value: 0.1,
      min: 0.1,
      max: 1,
      step: 0.01,
    },
  });

  const ref = useRef<THREE.InstancedMesh>();

  useEffect(() => {
    if (ref.current) {
      let i = 0;
      const vector = new THREE.Vector3();
      const center = new Vector3(0, 0, 0);
      const color = new THREE.Color();
      const colors = {
        na: '#0269ff',
        sa: '#ed4f33',
        eu: '#17cd72',
        ap: '#edb432',
        au: '#5d42f5',
        'n/a': '#151b37',
      };

      console.time('dots');

      for (let lat = -90; lat <= 90; lat += 180 / 200) {
        const radius = Math.cos(degree2Radian(Math.abs(lat))) * 602;
        const circumference = radius * Math.PI * 2;
        const dotsForLat = Math.ceil(circumference * density);

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

            const [r, g, b] = pixel;
            let region = getRegionFromColor(r, g, b) || 'n/a';
            ref.current.setColorAt(i, color.set('#151b37'));

            i++;
          }
        }
      }

      console.timeEnd('dots');

      // Update the instance
      ref.current.instanceColor.needsUpdate = true;
      ref.current.instanceMatrix.needsUpdate = true;
    }
  }, [spcR, row, ref, density]);

  return (
    <>
      <instancedMesh
        ref={ref}
        args={[geometry, material, count]}
      ></instancedMesh>
      {/* <mesh
        position={[0, 0, 0]}
        onPointerMove={(event) => {
          // console.log(event);
        }}
      >
        <sphereBufferGeometry attach="geometry" args={[600, 32 * 4, 32 * 4]} />
        <meshBasicMaterial
          transparent
          attach="material"
          color={'white'}
          map={mapTexture}
          opacity={1}
        />
      </mesh> */}
    </>
  );
};

export default Dots;
