import styled from 'styled-components';

export const Ellipsis = styled.div<{ size: number }>`
  max-width: ${({ size }) => size}px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default Ellipsis;
