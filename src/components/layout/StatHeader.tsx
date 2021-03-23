import React from 'react';
import styled from 'styled-components';
import { SelectCoin } from '../SelectCoin';
import { Content } from './Content';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  border-bottom: 1px solid var(--border-color);
`;

export const HeaderStat: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Wrapper>
      <Content padding>
        <Header>
          <div>{children}</div>
          <SelectCoin />
        </Header>
      </Content>
    </Wrapper>
  );
};
