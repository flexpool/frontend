import React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import styled from 'styled-components';

const StyledRadio = styled(RadioGroupPrimitive.Item)`
  all: unset;
  width: 16px;
  height: 16px;
  border-radius: 16px;
  border: 2px solid #313131;
  transition: all 0.1s ease-out;
  margin-right: 10px;
`;

const GuideTypeRadioButton = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  border-radius: 5px;
  padding: 18px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.045);
  border: 2px solid #313131;

  & > * {
    flex-shrink: 0;
  }

  &:hover {
    border: 2px solid #0069ff;
    background: rgba(0, 105, 255, 0.12);

    ${StyledRadio} {
      border: 2px solid #0069ff;
    }
  }

  &[data-selected='true'] {
    border: 2px solid #0069ff;
    background: rgba(0, 105, 255, 0.12);

    ${StyledRadio} {
      border: 2px solid #0069ff;
    }
  }

  transition: all 0.2s ease-out;
`;

export const RadioGroup = styled(RadioGroupPrimitive.Root)`
  ${GuideTypeRadioButton} + ${GuideTypeRadioButton} {
    margin-top: 14px;
  }
`;

const StyledIndicator = styled(RadioGroupPrimitive.Indicator)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
  border-radius: 16px;

  &:after {
    display: 'block';
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 7px;
    background-color: #1a79ff;
    transition: all 0.1s ease-out;
  }

  transition: all 0.1s ease-out;
`;

type Props = {
  onClick: () => void;
  selected: boolean;
  children: React.ReactNode;
  value: string;
};

export const GuideTypeRadio = ({
  onClick,
  selected,
  children,
  value,
}: Props) => {
  return (
    <GuideTypeRadioButton data-selected={selected} onClick={onClick}>
      <StyledRadio value={value} id={value}>
        <StyledIndicator />
      </StyledRadio>
      {children}
    </GuideTypeRadioButton>
  );
};

export default GuideTypeRadio;