import React, { createContext, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { geo2CanvasXY, radian2Degree } from '../../utils';

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = CANVAS_WIDTH / 2;

const WorldMapCanvasContext = createContext<any>(null);

type Props = {
  children: React.ReactNode;
};

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

const WorldMapCanvasProvider = ({ children }: Props) => {
  const image = useLoader(THREE.ImageLoader, './map.png');

  const map = useMemo(() => {
    const worldMap = document.createElement('canvas');
    worldMap.width = CANVAS_WIDTH;
    worldMap.height = CANVAS_HEIGHT;
    const context = worldMap.getContext('2d');
    context?.drawImage(image, 0, 0, worldMap.width, worldMap.height);
    return context!.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data;
  }, [image]);

  const getPixelData = (x, y) => {
    const i = Math.floor(y - 1) * CANVAS_WIDTH * 4 + Math.floor(x) * 4;
    return [map[i], map[i + 1], map[i + 2], map[i + 3]];
  };

  const getCartesianPixelData = (x, y, z: number) => {
    const pos = geo2CanvasXY(
      getPhi(z, x, y) - 90,
      getTheta(z, x) - 180,
      CANVAS_HEIGHT,
      CANVAS_WIDTH
    );

    return getPixelData(pos.x, pos.y);
  };

  const getGeoPixelData = (latitude: number, longitude: number) => {
    const { x, y } = geo2CanvasXY(
      latitude,
      longitude,
      CANVAS_HEIGHT,
      CANVAS_WIDTH
    );
    return getPixelData(x, y);
  };

  return (
    <WorldMapCanvasContext.Provider
      value={{ map, getPixelData, getCartesianPixelData, getGeoPixelData }}
    >
      {children}
    </WorldMapCanvasContext.Provider>
  );
};

export const useWorldMapCanvasContext = () => {
  return React.useContext(WorldMapCanvasContext);
};

export default WorldMapCanvasProvider;
