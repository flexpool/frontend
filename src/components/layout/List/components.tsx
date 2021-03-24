import { keyframes } from 'styled-components';
import styled from 'styled-components/macro';

const Container = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 4px;
  border-spacing: 0 3px;
  color: var(--text-secondary);
  border-collapse: separate;
  border: 1px solid var(--border-color);
`;

const shared = `
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  &:first-child {
    padding-left: 1.5rem;
  }
  &:last-child {
    padding-right: 1.5rem;
  }
`;

const Th = styled.th<{ alignRight?: boolean }>`
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.75rem;
  white-space: nowrap;

  font-weight: 700;
  text-align: left;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  ${shared};
  ${(p) => p.alignRight && `text-align: right;`};
`;

const Td = styled.td<{ alignRight?: boolean }>`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  text-align: left;
  color: var(--text-secondary);
  font-weight: 500;
  border-top: 1px solid var(--border-color);

  ${shared};
  color: var(--text-primary);
  background: var(--bg-primary);
  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  ${(p) => p.alignRight && `text-align: right;`};
`;

const Tr = styled.tr`
  margin-top: 2px;
`;

export const Table = {
  Container,
  Td,
  Th,
  Tr,
};

const pulse = keyframes`
  0% {
    background-color: var(--bg-secondary);
  }
  50% {
    background-color: rgba(128, 128, 128, .2);
  }
  100 {
    background-color: var(--bg-secondary);
  }
`;

export const Skeleton = styled.div`
  background: var(--bg-secondary);
  width: 100px;
  height: 1rem;
  border-radius: 4px;
  animation: ${pulse} 2s linear infinite;
  margin-top: 3px;
  margin-bottom: 3px;
`;

export const HorizontalScrollWrapepr = styled.div`
  width: 100%;
  overflow-x: auto;
`;
