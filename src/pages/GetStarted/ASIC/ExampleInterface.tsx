import { CopyButton } from '@/components/CopyButton';
import React from 'react';
import styled from 'styled-components';

export const ExampleInterfaceWrapper = styled.div`
  display: grid;
  align-items: center;
  width: 100%;
  background-color: var(--bg-secondary);
  border-radius: 15px;
  padding: 10px;
  overflow: auto;
`;

const ExampleInterfaceMenu = styled.div`
  background-color: var(--bg-primary);
  border-radius: 15px;
  padding: 40px;
  margin: 20px;
`;

const EntryInputGroupWrapper = styled.div`
  margin-top: 30px;

  &:first-child {
    margin-top: 0px;
  }
`;

const EntryInput = styled.div`
  width: 100%;
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  padding: 10px;
  border-radius: 5px 0px 0px 5px;
  font-family: 'Roboto Mono';
  white-space: nowrap;
  overflow: auto;
`;

const EntryInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const EntryInputCopy = styled.div`
  button {
    height: 100%;
    width: 100%;
    width: 50px;
    border: 1px solid var(--border-color);
    border-radius: 0px 5px 5px 0px;
    background-color: var(--bg-secondary);
  }
`;

const Entry: React.FC<{
  label: string;
  placeholder: string;
}> = ({ label, placeholder }) => {
  return (
    <EntryInputGroupWrapper>
      <h3>{label}</h3>
      <EntryInputWrapper>
        <EntryInput>{placeholder}</EntryInput>
        <EntryInputCopy>
          <CopyButton text={placeholder} />
        </EntryInputCopy>
      </EntryInputWrapper>
    </EntryInputGroupWrapper>
  );
};

export const ExampleInterface: React.FC<{
  poolNum: string;
  url: string;
  login: string;
}> = ({ poolNum, url, login }) => {
  return (
    <ExampleInterfaceMenu>
      <h1>Pool {poolNum}</h1>
      <Entry label="Pool URL" placeholder={url} />
      <Entry label="Login" placeholder={login} />
      <Entry label="Password (Optional)" placeholder="x" />
    </ExampleInterfaceMenu>
  );
};
