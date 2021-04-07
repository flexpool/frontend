import React from 'react';
import Tippy from '@tippyjs/react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';
import styled, { UIVariant } from 'styled-components/macro';
import './Tooltip.scss';

const IconWrapper = styled.span<{ variant?: UIVariant }>`
  transform: translateY(20%);
  display: inline-flex;
  align-items: flex-end;
  /** variant */
  ${(p) => {
    if (p.variant) {
      return `
      color: ${p.theme.color[p.variant]};
      `;
    }
  }}
`;

const Message = styled.div`
  line-height: 1.4;
  color: var(--text-primary);
`;

export const TooltipContent: React.FC<{
  message?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
}> = (props) => {
  return (
    <div
      className={`info-tooltip-content` + (props.action ? ' has-action' : '')}
    >
      <Message>{props.message || props.children}</Message>
      <div className="action-wrapper">{props.action}</div>
    </div>
  );
};

export const Tooltip: React.FC<{
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: UIVariant;
}> = ({ children, icon, variant = 'primary' }) => {
  return (
    <Tippy
      content={children}
      delay={0}
      animation="shift-away"
      theme="light"
      interactive={true}
    >
      <IconWrapper variant={variant}>
        {icon || <AiOutlineInfoCircle />}
      </IconWrapper>
    </Tippy>
  );
};
