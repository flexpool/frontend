import React from 'react';
import Arc from '../Arc';
import { SERVERS } from '../../constants';

type Coordinate = { longitude: number; latitude: number };

const ArcOne = [
  {
    longitude: SERVERS[0].longitude,
    latitude: SERVERS[0].latitude,
  },
  {
    longitude: SERVERS[7].longitude,
    latitude: SERVERS[7].latitude,
  },
] as [Coordinate, Coordinate];

const ArcTwo = [
  {
    longitude: SERVERS[5].longitude,
    latitude: SERVERS[5].latitude,
  },
  {
    longitude: SERVERS[1].longitude,
    latitude: SERVERS[1].latitude,
  },
] as [Coordinate, Coordinate];

const Arcs = () => {
  return (
    <>
      <Arc delay={2} initial={ArcOne} />
      <Arc delay={4} initial={ArcTwo} />
    </>
  );
};

export default React.memo(Arcs);
