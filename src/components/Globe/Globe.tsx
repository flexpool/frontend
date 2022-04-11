import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stats } from '@react-three/drei';
import { Vector3 } from 'three';
import styled from 'styled-components';
import { Leva } from 'leva';
import Halo from './components/Halo';
import Sphere from './components/Sphere';
import Dots from './components/Dots';
import Marker from './components/Marker';
import Arc from './components/Arc';
import { useStore } from './store';
import useInterval from '@/hooks/useInterval';
import WorldMapCanvasProvider, {
  useWorldMapCanvasContext,
} from './providers/WorldMapCanvasProvider';
import useGetRegionHashRate from '@/hooks/useGetRegionHashrate';
import { REGION_MAP, SERVERS } from './constants';

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

  const [arcs, setArcs] = useState<{ from: number; to: number }[]>([
    { from: 0, to: 7 },
    { from: 5, to: 1 },
  ]);

  useInterval(() => {
    if (document && !document.hidden) {
      const from = Math.floor(Math.random() * 9);
      const to = Math.floor(Math.random() * 9);
      setArcs((a) => a.concat([{ from, to }]));
    }
  }, 3000);

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
            {/* <CanadaFlag /> */}
            {arcs.map((arc, index) => (
              <Arc
                key={`${arc.from}-${arc.to}-${index}`}
                fromLatitude={SERVERS[arc.from].latitude}
                fromLongitude={SERVERS[arc.from].longitude}
                toLatitude={SERVERS[arc.to].latitude}
                toLongitude={SERVERS[arc.to].longitude}
              />
            ))}

            {SERVERS.map((server, index) => (
              <Marker
                key={index}
                {...server}
                lat={server.latitude}
                long={server.longitude}
                color={server.color}
              />
            ))}
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
  const region = useStore((state) => state.region);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const hashrate = useGetRegionHashRate();

  useLoader.preload(THREE.ImageLoader, './map.png');
  useLoader.preload(THREE.TextureLoader, 'matcap11.png');

  useEffect(() => {
    const saveMousePos = (e: any) => {
      if (overlayRef.current) {
        overlayRef.current.style.left = `${Math.min(
          e.clientX + 10,
          window.innerWidth - 280
        )}px`;
        overlayRef.current.style.top = `${e.clientY + 10}px`;
      }
    };

    window.addEventListener('mousemove', saveMousePos);
    return () => {
      window.removeEventListener('mousemove', saveMousePos);
    };
  }, []);

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
      <StyledRegionOverlay
        style={{
          display: region ? 'block' : 'none',
        }}
        ref={overlayRef}
      >
        <div>{REGION_MAP[region]}</div>

        <HashrateList>
          {region === 'ru' && <div>This region is not available.</div>}
          {region === 'af' && (
            <div>
              No server locations in this region. <br />
              Closest region you can use is Europe.
            </div>
          )}
          {region === 'me' && (
            <div>
              No server locations in this region. <br />
              Closest regions you can use are Europe & Asia Pacific.
            </div>
          )}

          {hashrate?.etc?.[region] && (
            <Item>
              <div>Ethereum Classic</div>
              <div>{hashrate.etc[region]}</div>
            </Item>
          )}

          {hashrate?.xch?.[region] && (
            <Item>
              <div>Chia</div>
              <div>{hashrate.xch[region]}</div>
            </Item>
          )}
        </HashrateList>
      </StyledRegionOverlay>
    </StyledGlobe>
  );
};

const StyledRegionOverlay = styled.div`
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  padding: 1rem;
  color: white;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  width: 280px;
  min-height: 45px;
  position: fixed;
  pointer-events: none;
`;

const Item = styled.div`
  display: flex;

  & > div:first-child {
    flex: 1;
  }
`;

const HashrateList = styled.div`
  color: #a3a2a2;
  margin-top: 6px;
  font-size: 0.85rem;
  line-height: 1.4;

  & > ${Item} + ${Item} {
    margin-top: 4px;
  }
`;

export default Globe;
