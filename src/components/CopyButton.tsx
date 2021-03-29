import Tippy from '@tippyjs/react';
import copy from 'copy-to-clipboard';
import React from 'react';
import { FaClipboard, FaClipboardCheck } from 'react-icons/fa';
import styled from 'styled-components';
import { Button } from './Button';

const Btn = styled(Button)`
  border-radius: 50%;
  color: var(--text-tertiary);
  background: var(--bg-secondary);
  height: 35px;
  min-height: 35px;
  width: 35px;
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

export const CopyButton: React.FC<{ text: string; description?: string }> = ({
  text,
  description = 'Copy',
}) => {
  const [justCopied, setJustCopied] = React.useState(false);
  return (
    <Tippy
      content={
        <div style={{ padding: '5px' }}>
          {justCopied ? 'Copied!' : description}
        </div>
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
        {justCopied ? <FaClipboardCheck /> : <FaClipboard />}
      </Btn>
    </Tippy>
  );
};
