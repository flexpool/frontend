import React from 'react';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import DownshiftSelect from '@/components/Form/DownshiftSelect';
import { useThemeMode } from '@/context/ThemeModeProvider';

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
  background: #444 !important;
`;
const CircleSystem = styled(Circle)`
  background: #444;
  box-shadow: inset -10px -10px 0px -5px white;
`;

const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const NewSelectTheme = () => {
  const { t } = useTranslation('common');
  const { mode, change, color } = useThemeMode();

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

  if (typeof mode === 'undefined') return null;

  return (
    <DownshiftSelect
      initialSelectedItem={
        items.find((item) => item.value === mode) || items[0]
      }
      onSelectedItemChange={(changes) =>
        change((changes.selectedItem?.value as any) || 'light')
      }
      items={items}
    />
  );
};
