import React, { useState } from 'react';
import Arc from '../Arc';
import useInterval from '@/hooks/useInterval';
import { SERVERS } from '../../constants';

const Arcs = () => {
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
      {arcs.map((arc, index) => (
        <Arc
          key={`${arc.from}-${arc.to}-${index}`}
          fromLatitude={SERVERS[arc.from].latitude}
          fromLongitude={SERVERS[arc.from].longitude}
          toLatitude={SERVERS[arc.to].latitude}
          toLongitude={SERVERS[arc.to].longitude}
        />
      ))}
    </>
  );
};

export default Arcs;
