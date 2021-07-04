import styled from 'styled-components/macro';

export const GweiToggle = styled.button`
  height: 48px;
  width: 100%;
  padding: 0 1rem;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UnitContainer = styled.div`
  padding: 0 1rem;
`;

export const ActiveToggleText = styled.span`
  color: var(--text-primary);
`;
export const InactiveToggleText = styled.span`
  color: var(--text-tertiary);
`;

export const PercentageDisplaySpan = styled.span<{ color?: string }>`
  ${(p) =>
    p.color === 'yellow' &&
    `
          color: var(--warning);
          `}
  ${(p) =>
    p.color === 'red' &&
    `
      color: var(--danger);
      `}
`;
export const LowPayoutContainer = styled.div`
  color: var(--danger);
`;
