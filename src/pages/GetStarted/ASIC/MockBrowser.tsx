import React from 'react';
import styled from 'styled-components';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PageHeader = styled.div`
  height: 60px;
  border-bottom: 1px solid var(--border-color);
`;

const PageBody = styled.div`
  flex: 1;
  display: flex;
`;

const PageContent = styled.div`
  flex: 1;
`;

const PageAside = styled.aside`
  border-right: 1px solid var(--border-color);
  flex-basis: 240px;
`;

const BrowserWindow = styled.div`
  min-height: 948px;
  border-radius: 18px;

  border: 2px solid var(--border-color);

  display: flex;
  flex-direction: column;
`;

const BrowserContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const AddressBar = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  justify-self: center;
  border-radius: 5px;
  width: 535px;
  height: 30px;
  border-radius: 5px;
  background-color: var(--border-color);
  opacity: 0.4;
`;

const RoundButton = styled.div`
  display: inline-block;
  height: 12px;
  width: 12px;
  border-radius: 12px;
`;

const RedCircle = styled(RoundButton)`
  background-color: #ff605c;
`;

const YellowCircle = styled(RoundButton)`
  background-color: #ffbd44;
`;

const GreenCircle = styled(RoundButton)`
  background-color: #00ca4e;
  margin-right: 20px;
`;

const BrowserToolBar = styled.div`
  height: 60px;
  border-bottom: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: relative;

  ${RoundButton} + ${RoundButton} {
    margin-left: 8px;
  }
`;

export const MockBrowser = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserWindow>
      <BrowserToolBar>
        <RedCircle />
        <YellowCircle />
        <GreenCircle />
        <FiChevronLeft color="var(--border-color)" />
        <FiChevronRight color="var(--border-color)" />
        <AddressBar />
      </BrowserToolBar>
      <BrowserContent>
        <PageHeader></PageHeader>
        <PageBody>
          <PageAside></PageAside>
          <PageContent>{children}</PageContent>
        </PageBody>
      </BrowserContent>
    </BrowserWindow>
  );
};

export default MockBrowser;
