import styled from 'styled-components';
import React from 'react';
import { AnchoredPop } from 'src/components/AnchoredPop';
import { Button } from 'src/components/Button';
import { PropsOf } from 'src/types/ReactHelp.types';
import SVG from 'react-inlinesvg';
// eslint-disable-next-line
import arrow from './arrow.svg';

const SelectArrowSvg = styled(SVG)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  height: auto !important;
`;

const SCSelectButton = styled(Button)`
  min-width: 100px;
  font-weight: 600;
  position: relative;
  padding-right: 2.5rem;
  width: 100%;
  background: var(--bg-secondary);
  &:hover {
    border-color: var(--primary);
  }
`;

const Placeholder = styled.span`
  color: ${(p) => p.theme.text.secondary};
`;

export type SelectButtonProps = PropsOf<typeof Button> & {
  placeholder: React.ReactNode;
};

export const SelectButton = React.forwardRef<HTMLElement, SelectButtonProps>(
  ({ placeholder, children, ...rest }, ref) => {
    return (
      <SCSelectButton ref={ref as any} {...rest}>
        {children || <Placeholder>{placeholder}</Placeholder>}
        {/* <SelectArrowSvg src={arrow} /> */}
      </SCSelectButton>
    );
  }
);

export const DropdownList = styled(AnchoredPop)`
  background: var(--bg-secondary);
  ${(p) => p.theme.boxShadow};
  ${(p) => p.theme.border};
  padding: 10px;
  min-width: 200px;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
`;

export const SelectOptionButton = styled(Button)`
  background-color: var(--bg-secondary);
  border: none;
  font-weight: 600;
  display: block;
  width: 100%;
  text-align: left;
  transition: 0.2s all;
  position: relative;
  & > * {
    pointer-events: none;
  }
  &:hover {
    ${(p) => `
      background-color: ${p.theme.color.primary};
    `};
    color: white;
  }

  ${(p: { active?: boolean; theme: any }) =>
    p.active &&
    `
    &:before {
      position: absolute;
      content: '';
      display: block;
      top: 50%;
      transform: translateY(-50%);
      right: 8px;
      width: 6px;
      height: 6px;
      border-radius: 3px;
      background: ${p.theme.color.primary}
    }
  `}
`;

SelectOptionButton.defaultProps = {
  size: 'xs',
};
