import React from 'react';
import styled from 'styled-components';

type Item = {
  term: React.ReactNode;
  description: React.ReactNode;
};

type DescriptionListProps = {
  items: Item[];
};

const DT = styled.dt`
  flex: 0 1 25%;
  font-weight: 600;
  padding: 1rem 0;
`;

const DD = styled.dd`
  flex: 1 1 51%;
  padding: 1rem 0;
  font-weight: 400;
`;

const DL = styled.dl`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;

  ${DT}:not(:first-child) {
    border-top: 1px solid var(--border-color);
  }

  ${DD}:not(:nth-child(2)) {
    border-top: 1px solid var(--border-color);
  }
`;

const DescriptionList = ({ items }: DescriptionListProps) => {
  const terms = items.reduce(
    (allTerms, { term, description }, index) => [
      ...allTerms,
      <DT key={`term-${index}`}>{term}</DT>,
      <DD key={`description-${index}`}>{description}</DD>,
    ],
    [] as React.ReactNode[]
  );

  return <DL>{terms}</DL>;
};

export default DescriptionList;
