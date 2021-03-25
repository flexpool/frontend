import React from 'react';
import styled from 'styled-components/macro';
import { Skeleton } from './layout/Skeleton';

const StatItemWrapper = styled.div``;
const StatItemValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;
const StatItemSubValue = styled.div`
  font-weight: 700;
  margin-top: 0.5rem;
  color: var(--text-secondary);
`;
const StatItemTitle = styled.div`
  margin-top: 0.5rem;
`;

export const StatItem: React.FC<{
  value?: React.ReactNode;
  title?: React.ReactNode;
  subValue?: React.ReactNode;
}> = ({ value, title, subValue }) => {
  return (
    <StatItemWrapper>
      <StatItemValue>
        {typeof value === undefined ? <Skeleton /> : value}
      </StatItemValue>
      {title && <StatItemTitle>{title}</StatItemTitle>}
      {typeof subValue !== 'undefined' && (
        <StatItemSubValue>{subValue || <Skeleton />}</StatItemSubValue>
      )}
    </StatItemWrapper>
  );
};
