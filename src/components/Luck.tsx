import styled from 'styled-components';
import { useLocalizedNumberValueFormatter } from 'src/utils/si.utils';

const LuckValue = styled.span<{ value: number }>`
  font-weight: 600;
  ${(p) =>
    p.value < 1 &&
    `
    color: var(--success);
  `}
`;

export const Luck: React.FC<{ value: number }> = ({ value }) => {
  const numberFormatter = useLocalizedNumberValueFormatter();
  return (
    <LuckValue value={value}>
      {numberFormatter(value, { style: 'percent', maximumFractionDigits: 1 })}
    </LuckValue>
  );
};
