import styled from 'styled-components';
import { Button } from 'src/components/Button';
import { ScrollArea } from 'src/components/layout/ScrollArea';

export const Split = styled.div`
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  max-height: calc(100vh - 166px);
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Nav = styled.div`
  width: 200px;
  flex-grow: 0;
  flex-shrink: 0;
  border-right: 1px solid var(--border-color);
  padding: 0.5rem;
  @media screen and (max-width: 768px) {
    display: flex;
    padding: 1rem 1.25rem;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    width: 100%;
  }
`;

export const NavItem = styled(Button)`
  width: 100%;
  border: none;
  @media screen and (max-width: 768px) {
    width: auto;
  }
`;

export const PageWrapper = styled(ScrollArea)`
  padding: 1rem 1.25rem;
  flex-grow: 1;
  @media screen and (max-width: 768px) {
    min-height: 1px;
    height: 1px;
  }
  & > * {
    width: 100%;
  }
`;

export const SettingsBtn = styled(Button)`
  span {
    margin-left: 0.5rem;
  }
  @media screen and (max-width: 768px) {
    width: 42px;
    padding: 0;
    justify-content: center;
    span {
      display: none;
    }
  }
`;