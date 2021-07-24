import styled from 'styled-components';
import { Button } from 'src/components/Button';
import Link from 'next/link';

export const ActionIconContainer = styled.div`
  display: inline-flex;
  & > * {
    margin: 0;
    margin-left: 0.3rem;
  }
`;
export const ActionIcon = styled(Button)`
  width: 32px;
  padding: 0;
  justify-content: center;
`;

export const Wrapper = styled.div`
  padding-top: 9rem;
  padding-bottom: 5rem;
  background: var(--bg-secondary);
  h2 {
    font-size: 2rem;
  }
`;

export const CoinName = styled.a`
  color: var(--text-primary);
  display: flex;
  align-items: center;
  & > * {
    margin-right: 0.5rem;
  }
`;

export const TickerName = styled.span`
  color: var(--text-tertiary);
`;

export const PriceChange = styled.span<{ direction: 'up' | 'down' }>`
  svg {
    height: 14px;
    width: 10px;
    margin-right: 0.25rem;
  }
  ${(p) => {
    switch (p.direction) {
      case 'up':
        return `
        color: var(--success);
      `;
      case 'down':
        return `
        color: var(--danger);
      `;
    }
  }}
`;
