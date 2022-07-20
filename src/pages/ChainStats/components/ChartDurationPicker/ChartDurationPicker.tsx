import styled, { css } from 'styled-components';

const DurationButton = styled.button<{ selected: boolean }>`
  all: unset;
  padding: 8px 24px;
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  border-radius: 20px;

  @media screen and (max-width: 768px) {
    padding: 6px 14px;
  }

  ${(p) =>
    p.selected &&
    css`
      background-color: rgb(128 128 128 / 15%);
    `}

  &:hover {
    background-color: rgb(128 128 128 / 15%);
  }
`;

type DurationsProps = {
  options: { label: React.ReactNode; value: any }[];
  selected: any;
  onChange: (value: any) => void;
};

const DurationsContainer = styled.div`
  display: inline-block;
  margin-left: auto;
  align-self: end;
  margin-bottom: 34px;

  ${DurationButton} + ${DurationButton} {
    margin-left: 8px;
  }

  @media screen and (max-width: 768px) {
    margin-left: -8px;
    margin-top: 16px;
    margin-bottom: 0px;
  }
`;

export const ChartDurationPicker = ({
  options,
  onChange,
  selected,
}: DurationsProps) => {
  return (
    <DurationsContainer>
      {options.map((option, index) => (
        <DurationButton
          key={index}
          selected={selected === option.value}
          onClick={() => {
            onChange(option.value);
          }}
        >
          {option.label}
        </DurationButton>
      ))}
    </DurationsContainer>
  );
};

export default ChartDurationPicker;
