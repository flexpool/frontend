import React from 'react';
import { Highlight } from 'src/components/Typo/Typo';

export const SectionWrapper = ({
  position,
  children,
  title,
}: {
  position: number;
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <>
      <h2>
        <Highlight>#{position}</Highlight> {title}
      </h2>
      {children}
    </>
  );
};

export default SectionWrapper;
