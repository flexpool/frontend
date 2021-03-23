import { getDisplayLuck } from 'src/utils/luck.utils';
import styled from 'styled-components';

const LuckValue = styled.span<{ value: number }>`
  font-weight: 600;
  ${(p) =>
    p.value < 1 &&
    `
    color: var(--success);
  `}
`;

export const Luck: React.FC<{ value: number }> = ({ value }) => {
  console.log(value);
  return <LuckValue value={value}>{getDisplayLuck(value)}</LuckValue>;
};
