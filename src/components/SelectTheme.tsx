import React from 'react';
import { useDispatch } from 'react-redux';
import { localSettingsSet } from 'src/rdx/localSettings/localSettings.actions';
import { LocalSettingsState } from 'src/rdx/localSettings/localSettings.reducer';
import { useReduxState } from 'src/rdx/useReduxState';
import styled from 'styled-components/macro';
import { Select } from './Form/Select/Select';

const Circle = styled.div`
  height: 20px;
  margin-right: 0.5rem;
  width: 20px;
  border-radius: 5px;
  background: white;
  border: none;
`;

const CircleLight = styled(Circle)`
  background: #ccc;
`;
const CircleDark = styled(Circle)`
  background: #444;
`;
const CircleSystem = styled(Circle)`
  background: #444;
  box-shadow: inset -10px -10px 0px -5px white;
`;

const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const SelectTheme = () => {
  const localSettings = useReduxState('localSettings');
  const d = useDispatch();

  const handleTickerChange = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      d(
        localSettingsSet({
          colorMode: (e.target as HTMLButtonElement)
            .value as LocalSettingsState['colorMode'],
        })
      );
    },
    [d]
  );

  return (
    <Select
      value={localSettings.colorMode}
      onChange={handleTickerChange}
      options={[
        {
          label: (
            <OptionWrapper>
              <CircleSystem /> System Theme
            </OptionWrapper>
          ),
          value: 'system',
        },
        {
          label: (
            <OptionWrapper>
              <CircleDark /> Dark Theme
            </OptionWrapper>
          ),
          value: 'dark',
        },
        {
          label: (
            <OptionWrapper>
              <CircleLight /> Light Theme
            </OptionWrapper>
          ),
          value: 'light',
        },
      ]}
    />
  );
};
