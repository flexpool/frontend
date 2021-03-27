import styled from 'styled-components/macro';

const Container = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 5px;
  border-spacing: 0 3px;
  color: var(--text-secondary);
  border-collapse: separate;
  border: none;
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

const Th = styled.th<{ alignRight?: boolean; hoverable?: boolean }>`
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
  ${(p) =>
    p.hoverable &&
    `
    &:hover {
      color: var(--primary);
      cursor: pointer;
    }
  `};
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

export const HorizontalScrollWrapepr = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  &:not(:first-child) {
    margin-top: 1rem;
  }
`;
