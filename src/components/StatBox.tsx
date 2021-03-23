import React from 'react';
import styled from 'styled-components/macro';

export const StatBoxContainer = styled.div`
  display: flex;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  flex-wrap: wrap;
  color: var(--text-primary);
`;

const StatBoxC = styled.div`
  border-radius: 4px;
  padding: 1.5rem 2rem;
  border: 1px solid var(--border-color);
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

export const StatBox: React.FC<{ title: string; value: React.ReactNode }> = ({
  title,
  value,
}) => (
  <StatBoxC>
    <Title>{title}</Title>
    <Value>{value}</Value>
  </StatBoxC>
);
