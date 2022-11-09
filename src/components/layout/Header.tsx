import styled from 'styled-components';
import { Content } from './Content';

export const StyledHeader = styled.div`
  border-bottom: 1px solid var(--border-color);
  padding: 22px 0;
  z-index: 1;
`;

export const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <StyledHeader>
      <Content>{children}</Content>
    </StyledHeader>
  );
};

export default Header;
