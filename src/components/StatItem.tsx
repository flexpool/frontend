import React from 'react';
import styled from 'styled-components';
import { Skeleton } from './layout/Skeleton';

const StatItemWrapper = styled.div``;
const StatItemValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  @media screen and (max-width: 560px) {
    font-size: 1.35rem;
  }
  .ticker {
    color: var(--text-primary);
  }
`;
const StatItemSubValue = styled.div`
  font-weight: 700;
  margin-top: 0.5rem;
  color: var(--text-secondary);
`;
const StatItemTitle = styled.div`
  margin-top: 0.5em;
  @media screen and (max-width: 560px) {
    font-size: 0.875rem;
  }
`;

export const StatItem = React.memo(
  React.forwardRef<
    HTMLDivElement,
    JSX.IntrinsicElements['div'] & {
      value?: React.ReactNode;
      title?: React.ReactNode;
      subValue?: React.ReactNode;
    }
  >(({ value, title, subValue, ...rest }, ref) => {
    return (
      <StatItemWrapper {...rest} ref={ref}>
        <StatItemValue>{value || <Skeleton />}</StatItemValue>
        {title && <StatItemTitle>{title}</StatItemTitle>}
        {typeof subValue !== 'undefined' && (
          <StatItemSubValue>{subValue || <Skeleton />}</StatItemSubValue>
        )}
      </StatItemWrapper>
    );
  })
);
