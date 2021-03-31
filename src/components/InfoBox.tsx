import React from 'react';
import styled from 'styled-components/macro';

const InfoBoxWrapper = styled.div<{ variant?: 'error' }>`
  padding: 1rem;
  border-radius: 5px;
  background: var(--primary);
  color: var(--text-on-bg);
  ${(p) =>
    p.variant === 'error' &&
    `
    background: var(--danger);
  `}
`;

export const InfoBox: React.FC<{
  variant: 'error';
  children: React.ReactNode;
}> = ({ variant, children }) => (
  <InfoBoxWrapper variant={variant}>{children}</InfoBoxWrapper>
);
