import styled from 'styled-components';
import { Button } from '@/components/Button';

export const SelectContainer = styled.div`
  position: relative;
`;

export const SelectArrowSvg = styled.div`
  display: flex;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  height: auto !important;
`;

export const Placeholder = styled.span`
  color: ${(p) => p.theme.text.secondary};
`;

export const SCSelectButton = styled(Button)`
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

  background-color: ${(p) => p.highlighted && p.theme.color.primary};

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

export const DropdownList = styled.ul`
  ${(p) => !p.isOpen && `display: none`}
  list-style-type: none;
  margin: 0;
  background: var(--bg-secondary);
  ${(p) => p.theme.boxShadow};
  ${(p) => p.theme.border};
  padding: 10px;
  min-width: 200px;
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 5px;
  width: 80%;
  position: absolute;
  right: 0;
  z-index: 100;
`;

export const DropdownItem = styled.li`
  margin: 0;
`;
