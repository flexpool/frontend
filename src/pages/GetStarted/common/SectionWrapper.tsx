import React from 'react';
import { Highlight } from 'src/components/Typo/Typo';

export const SectionWrapper = ({
  children,
  title,
  position,
}: {
  children: React.ReactNode;
  title: string;
  position?: number;
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
