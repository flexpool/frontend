import React, { useEffect, useRef } from 'react';
import { Highlight } from 'src/components/Typo/Typo';
import { useGuide } from '../common/GuideForm/GuideForm';

// TODO: Not SSR safe
const genId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

export const SectionWrapper = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const id = useRef(genId());
  const g = useGuide();

  useEffect(() => {
    var localId = id.current;
    if (g.get(localId) === -1) {
      g.add(localId);
      return () => {
        g.remove(localId);
      };
    }
  }, []);

  return (
    <>
      <h2>
        <Highlight>#{g.get(id.current) + 1}</Highlight> {title}
      </h2>
      {children}
    </>
  );
};

export default SectionWrapper;
