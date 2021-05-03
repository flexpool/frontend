import styled from 'styled-components/macro';

const Container = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 5px;
  border-spacing: 0;
  color: var(--text-secondary);
  border: none;
`;

const Th = styled.th<{ alignRight?: boolean; hoverable?: boolean }>`
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.75rem;
  white-space: nowrap;

  font-weight: 700;
  text-align: left;
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
  padding-top: 1rem;
  padding-bottom: 1rem;
  text-align: left;
  color: var(--text-secondary);
  font-weight: 500;
  border-top: 1px solid var(--border-color);

  color: var(--text-primary);
  ${(p) => p.alignRight && `text-align: right;`};
`;

const Tr = styled.tr<{ clickable?: boolean }>`
  &.highlighted {
    background: rgba(128, 128, 128, 0.06);
  }
  &:hover {
    .row-highlight,
    .item-hover-higjlight {
      color: var(--primary);
      text-decoration: underline;
    }
  }

  ${(p) =>
    p.clickable &&
    `
    cursor: pointer;
  `};
`;

const TBody = styled.tbody`
  line-height: attr(data-item-highlight);
`;

export const Table = {
  Container,
  Td,
  Th,
  Tr,
  TBody,
};

export const HorizontalScrollWrapepr = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const ListWrapper = styled.div`
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  &:not(:first-child) {
    margin-top: 1rem;
  }
`;
