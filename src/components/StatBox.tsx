import React from 'react';
import styled from 'styled-components/macro';
import { Card } from './layout/Card';
import { Skeleton } from './layout/Skeleton';

export const StatBoxContainer = styled.div`
  display: flex;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  padding: 0.5rem 0;
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
  margin: 0.5rem;
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
}> = ({ title, value }) => (
  <StatBoxC padding>
    <Title>{title}</Title>
    {((typeof value === 'undefined' || !value) && (
      <Skeleton style={{ height: 33, width: 70 }} />
    )) || <Value>{value}</Value>}
  </StatBoxC>
);
