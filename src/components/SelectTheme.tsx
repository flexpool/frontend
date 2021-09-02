import React from 'react';
import { useTranslation } from 'next-i18next';
import { useDispatch } from 'react-redux';
import { localSettingsSet } from 'src/rdx/localSettings/localSettings.actions';
import { LocalSettingsState } from 'src/rdx/localSettings/localSettings.reducer';
import { useReduxState } from 'src/rdx/useReduxState';
import styled from 'styled-components';
import { Select } from './Form/Select/Select';
import DownshiftSelect from '@/components/Form/DownshiftSelect';

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

/**
 * @deprecated A new implementation with Downshift is available
 */
export const SelectTheme = () => {
  const localSettings = useReduxState('localSettings');
  const d = useDispatch();
  const { t } = useTranslation('common');

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
              <CircleSystem /> {t('theme.default')}
            </OptionWrapper>
          ),
          value: 'system',
        },
        {
          label: (
            <OptionWrapper>
              <CircleDark /> {t('theme.dark')}
            </OptionWrapper>
          ),
          value: 'dark',
        },
        {
          label: (
            <OptionWrapper>
              <CircleLight /> {t('theme.light')}
            </OptionWrapper>
          ),
          value: 'light',
        },
      ]}
    />
  );
};

export const NewSelectTheme = () => {
  const { t } = useTranslation('common');
  const localSettings = useReduxState('localSettings');
  const d = useDispatch();

  const items = React.useMemo(
    () => [
      {
        label: (
          <OptionWrapper>
            <CircleSystem /> {t('theme.default')}
          </OptionWrapper>
        ),
        value: 'system',
      },
      {
        label: (
          <OptionWrapper>
            <CircleDark /> {t('theme.dark')}
          </OptionWrapper>
        ),
        value: 'dark',
      },
      {
        label: (
          <OptionWrapper>
            <CircleLight /> {t('theme.light')}
          </OptionWrapper>
        ),
        value: 'light',
      },
    ],
    [t]
  );

  return (
    <DownshiftSelect
      initialSelectedItem={
        items.find((item) => item.value === localSettings.colorMode) || items[0]
      }
      onSelectedItemChange={(changes) => {
        d(
          localSettingsSet({
            colorMode: changes.selectedItem
              ?.value as LocalSettingsState['colorMode'],
          })
        );
      }}
      items={items}
    />
  );
};
