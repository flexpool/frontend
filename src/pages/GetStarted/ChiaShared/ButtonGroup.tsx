import React from 'react';
import { Button } from 'src/components/Button';
import styled from 'styled-components';

const ButtonGroupWrapper = styled.div`
  display: flex;

  button {
    padding: 15px;
    color: var(--text-primary);
    font-weight: 600;
    position: relative;
    border-radius: 0;

    transition: background-color 0.1s;

    &.selected {
      background: var(--primary);
      color: #fff;
    }

    :first-child {
      border: 2px solid var(--border-color);
      border-radius: 5px 0px 0px 5px;
    }

    :last-child {
      border-radius: 0px 5px 5px 0px;
    }

    border: 2px solid var(--border-color);
    border-left: 0px;
    background: var(--bg-primary);
  }
`;

const OptionThumbnail = styled.img`
  height: 2em;
  width: 2em;
  margin-right: 1em;
`;

type ButtonGroupProps = {
  options: { [key: string]: { label: string; logoURL?: string } };
  selectedOption: string;
  setSelectedOption: (s: string) => void;
};

export const ButtonGroup = (props: ButtonGroupProps) => {
  var buttons: JSX.Element[] = [];

  for (const key in props.options) {
    buttons.push(
      <Button
        onClick={() => props.setSelectedOption(key)}
        className={`${props.selectedOption === key ? 'selected' : ''}`}
        key={key}
      >
        {props.options[key].logoURL && (
          <OptionThumbnail src={props.options[key].logoURL} />
        )}
        {props.options[key].label as string}
      </Button>
    );
  }

  return <ButtonGroupWrapper>{buttons}</ButtonGroupWrapper>;
};
