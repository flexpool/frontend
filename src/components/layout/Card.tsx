import styled from 'styled-components';
export const Card = styled.div<{ padding?: boolean; paddingShort?: boolean }>`
  border-radius: 5px;
  border: 1px solid var(--border-color);
  position: relative;
  background: var(--bg-primary);
  ${(p) =>
    p.padding &&
    `
    padding: 1rem 1.25rem;
  `}
  ${(p) =>
    p.paddingShort &&
    `
    padding: 1rem 1.25rem;
  `}
`;

export const CardBody = styled.div`
  padding: 1rem 1.25rem;
  &:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  & + * {
    margin-top: 0.75rem;
  }
`;

export const CardTitleCaption = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
`;

export const CardGrid = styled.div`
  display: grid;
  margin-top: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  width: 100%;
`;
