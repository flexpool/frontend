import styled from 'styled-components';
import { useLocalizedPercentFormatter } from 'src/utils/si.utils';

const LuckValue = styled.span<{ value: number }>`
  font-weight: 600;
  ${(p) =>
    p.value < 1 &&
    `
    color: var(--success);
  `}
`;

export const Luck: React.FC<{ value: number }> = ({ value }) => {
  const percentFormatter = useLocalizedPercentFormatter();
  return <LuckValue value={value}>{percentFormatter(value)}</LuckValue>;
};
