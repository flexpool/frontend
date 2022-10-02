import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stats, useDetectGPU } from '@react-three/drei';
import { Vector3 } from 'three';
import styled from 'styled-components';
import { Leva } from 'leva';
import Halo from './components/Halo';
import Sphere from './components/Sphere';
import Dots from './components/Dots';
import ServerMarkers from './components/ServerMarkers';
import Arcs from './components/Arcs';
import RegionOverlay from './components/RegionOverlay';
import WorldMapCanvasProvider, {
  useWorldMapCanvasContext,
} from './providers/WorldMapCanvasProvider';

import Image from 'next/image';
import useIsMounted from '@/hooks/useIsMounted';

const Scene = () => {
  const oc = useRef<any>(null);
  const { map } = useWorldMapCanvasContext();

  useEffect(() => {
    if (oc.current) {
      // Rotate to North America
      oc.current.setAzimuthalAngle(1.6);
      oc.current.setPolarAngle(0.91);
      oc.current.enableDamping = true;
      oc.current.update();
    }
  }, [oc]);

  const globeGroupRef = useRef<any>(null);

  useFrame((_, delta) => {
    if (map && globeGroupRef.current) {
      const { scale } = globeGroupRef.current;

      if (scale.x < 1) {
        scale.x = Math.min(1, scale.x + 0.625 * delta);
        scale.y = Math.min(1, scale.y + 0.625 * delta);
        scale.z = Math.min(1, scale.z + 0.625 * delta);
      }
    }
  });

  return (
    <>
      <OrbitControls
        ref={oc}
        autoRotate
        enableZoom={false}
        enablePan={false}
        autoRotateSpeed={0.2}
        enableDamping={false}
      />
      <group ref={globeGroupRef} scale={[0.5, 0.5, 0.5]}>
        {map && (
          <>
            <Halo />
            <Sphere />
            <Dots />
            <ServerMarkers />
            <Arcs />
          </>
        )}
      </group>
    </>
  );
};

const StyledGlobe = styled.div`
  position: absolute;
  width: 320px;
  height: 320px;
  right: -160px;
  user-select: none;
  cursor: pointer;
  display: none;

  &:active {
    cursor: grab;
  }

  @media screen and (min-width: 800px) {
    display: block;
    width: 600px;
    height: 600px;
    top: -15px;
    left: calc(60% - 94px);
  }
`;

const Globe = () => {
  useLoader.preload(THREE.ImageLoader, './map.png');
  useLoader.preload(THREE.TextureLoader, 'matcap11.png');

  const GPUTier = useDetectGPU();

  if (GPUTier.tier === 0) {
    return (
      <StyledGlobe>
        <Image
          src="/images/globe-screenshot.png"
          width={600}
          height={600}
          alt="Globe"
        />
        ;
      </StyledGlobe>
    );
  }

  return (
    <StyledGlobe>
      <Leva collapsed />
      <Canvas
        dpr={Math.min(
          2,
          typeof window !== 'undefined' ? window.devicePixelRatio : 1
        )}
        gl={{
          antialias: true,
          sortObjects: false,
        }}
        camera={{
          position: new Vector3(0, 0, 1250),
          far: 20000,
        }}
        id="globe-canvas"
      >
        <Suspense fallback={null}>
          <WorldMapCanvasProvider>
            <ambientLight intensity={1} />
            <Scene />
            {/* <Stats /> */}
          </WorldMapCanvasProvider>
        </Suspense>
      </Canvas>
      <RegionOverlay />
    </StyledGlobe>
  );
};

const GlobeWrapper = () => {
  const isMounted = useIsMounted();
  if (!isMounted) return null;

  return (
    <Suspense fallback={null}>
      <Globe />
    </Suspense>
  );
};

export default GlobeWrapper;
