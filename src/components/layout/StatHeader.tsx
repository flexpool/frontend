import React from 'react';
import styled from 'styled-components';
import { NewSelectCoin } from '../SelectCoin';
import { Content } from './Content';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  padding-bottom: 1rem;
  min-height: 82px;
`;

const Wrapper = styled.div`
  border-bottom: 1px solid var(--border-color);
`;

const HeaderContent = styled.div`
  margin-top: 0.5rem;
`;

export const HeaderStat: React.FC<{
  children: React.ReactNode;
  hideCoinSelect?: boolean;
}> = ({ children, hideCoinSelect = false }) => {
  return (
    <Wrapper>
      <Content>
        <Header>
          <HeaderContent>{children}</HeaderContent>
          {!hideCoinSelect && <NewSelectCoin />}
        </Header>
      </Content>
    </Wrapper>
  );
};
