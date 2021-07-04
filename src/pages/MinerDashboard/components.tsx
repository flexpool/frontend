import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Content } from 'src/components/layout/Content';

export const TabContent = styled.div`
  box-shadow: inset -1px 18px 19px -13px var(--bg-secondary);
  border-top: 2px solid var(--border-color);
  padding-top: 2rem;
`;

export const TabLinkContainer = styled(Content)`
  margin-top: 3rem;
  display: flex;
  overflow-x: auto;
`;

export const TabLink = styled(NavLink)`
  font-weight: 600;
  font-size: 1.125rem;
  height: 3rem;
  display: flex;
  align-items: center;
  color: var(--text-primary);
  padding: 0 1.5rem;
  border-bottom: 2px solid transparent;

  position: relative;
  z-index: 1;
  svg {
    margin-right: 0.5rem;
  }
  &.active {
    color: var(--primary);
    border-color: var(--primary);
  }

  &:hover {
    background: rgba(128, 128, 128, 0.04);
    color: var(--primary);
  }
  &:active {
    background: rgba(128, 128, 128, 0.07);
  }
  text-decoration: none !important;
`;
