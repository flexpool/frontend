import Tippy from '@tippyjs/react';
import copy from 'copy-to-clipboard';
import React from 'react';
import { FaCheck, FaCopy } from 'react-icons/fa';
import { Button } from 'src/components/Button';
import { TooltipContent } from 'src/components/Tooltip';
import styled from 'styled-components';

const ChiaGuiInputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ChiaGuiInputInner = styled.input`
  border: none;
  border-bottom: 1px solid var(--border-color);
  &:focus {
    border-bottom: 1px solid var(--border-color);
  }
`;

type ChiaGuiInputProps = {
  value: string;
  copyEnabled?: boolean;
};

export const ChiaGuiInput = (props: ChiaGuiInputProps) => {
  const { value, copyEnabled } = props;

  return (
    <>
      <input
        type="radio"
        value="Other"
        name="gender"
        style={{ height: '10px', width: '10px' }}
      />
      <ChiaGuiInputWrapper>
        <ChiaGuiInputInner
          value={value}
          type="text"
          readOnly
          onFocus={(event) => event.target.select()}
        ></ChiaGuiInputInner>
        {copyEnabled && <CopyButton text={value} />}
      </ChiaGuiInputWrapper>
    </>
  );
};

const Btn = styled(Button)`
  border-radius: 50%;
  color: var(--text-tertiary);
  background: var(--border-color);
  height: 32px;
  min-height: 32px;
  width: 32px;
  padding: 0;
  justify-content: center;
  display: inline-flex;
  transition: 0.05s;
  flex-shrink: 0;
  &:hover {
    background: var(--success);
    color: white;
  }
  svg {
    width: 50%;
    height: 50%;
  }
`;

export const CopyButton: React.FC<{
  text: string;
  description?: string;
  icon?: React.ReactNode;
}> = ({ text, description = 'Copy', icon }) => {
  const [justCopied, setJustCopied] = React.useState(false);
  return (
    <Tippy
      content={
        <TooltipContent message={justCopied ? 'Copied!' : description} />
      }
      delay={0}
      animation="shift-away"
      theme="light"
      interactive={true}
    >
      <Btn
        onClick={() => {
          copy(text);
          setJustCopied(true);
        }}
        onMouseLeave={() => setTimeout(() => setJustCopied(false), 1000)}
      >
        {justCopied ? <FaCheck /> : icon || <FaCopy />}
      </Btn>
    </Tippy>
  );
};
