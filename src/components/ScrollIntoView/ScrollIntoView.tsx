import React, { useRef, useEffect } from 'react';

type ScrollIntoViewProps = {
  children: React.ReactNode;
};

const ScrollIntoView = ({ children }: ScrollIntoViewProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return <div ref={ref}>{children}</div>;
};

export default ScrollIntoView;
