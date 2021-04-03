import Tippy from '@tippyjs/react';
import copy from 'copy-to-clipboard';
import React from 'react';
import { FaCheck, FaCopy } from 'react-icons/fa';
import styled from 'styled-components';
import { Button } from './Button';
import { TooltipContent } from './Tooltip';

const Btn = styled(Button)`
  border-radius: 50%;
  color: var(--text-tertiary);
  background: var(--bg-secondary);
  height: 32px;
  min-height: 32px;
  width: 32px;
  padding: 0;
  justify-content: center;
  display: inline-flex;
  transition: 0.05s;
  &:hover {
    background: var(--primary);
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
