import React from 'react';
import styled from 'styled-components/macro';
import { Card } from './layout/Card';
import { Skeleton } from './layout/Skeleton';

export const StatBoxContainer = styled.div`
  display: flex;
  margin-left: -1rem;
  margin-right: -1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  flex-wrap: wrap;
  color: var(--text-primary);
  & > * {
    margin-top: 2rem;
  }
`;

const StatBoxC = styled(Card)`
  flex-grow: 1;
  width: 1px;
  min-width: 150px;
  margin: 1rem;
  @media screen and (max-width: 900px) {
    width: 40%;
  }
`;

const Title = styled.span`
  text-transform: uppercase;
  font-weight: 600;
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const Value = styled.span`
  display: block;
  font-size: 1.75rem;
  font-weight: 600;
`;

export const StatBox: React.FC<{
  title: string;
  value: React.ReactNode;
  isLoading?: boolean;
}> = ({ title, value, isLoading }) => (
  <StatBoxC padding>
    <Title>{title}</Title>
    {(isLoading && <Skeleton style={{ height: 33, width: 70 }} />) || (
      <Value>{value}</Value>
    )}
  </StatBoxC>
);
