import React from 'react';
import styled from 'styled-components';
import { NewSelectCoin } from '../SelectCoin';
import { Content } from './Content';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const Wrapper = styled.div`
  border-bottom: 1px solid var(--border-color);
`;

const HeaderContent = styled.div`
  margin-top: 0.5rem;
`;

export const HeaderStat: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Wrapper>
      <Content>
        <Header>
          <HeaderContent>{children}</HeaderContent>
          {/* <SelectCoin /> */}
          <NewSelectCoin />
        </Header>
      </Content>
    </Wrapper>
  );
};
