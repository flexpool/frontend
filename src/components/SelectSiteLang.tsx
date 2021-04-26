import React from 'react';
import styled from 'styled-components/macro';
import { Select } from './Form/Select/Select';
import { Img } from './Img';
import { useTranslation } from 'react-i18next';
import { localStorage } from 'src/utils/localStorage';

const TickerFlag = styled(Img)`
  height: 20px;
  margin-right: 0.5rem;
`;

const TickerWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const langs = [
  {
    code: 'en-US',
    title: 'English',
    flag: 'en',
  },
  {
    code: 'ru',
    title: 'Русский',
    flag: 'ru',
  },
  {
    code: 'de',
    title: 'Deutsch',
    flag: 'de',
  },
  {
    code: 'es-ES',
    title: 'Español',
    flag: 'es',
  },
  {
    code: 'zh-CN',
    title: '中国人',
    flag: 'cn',
  },
  {
    code: 'cs',
    title: 'Česky',
    flag: 'cz',
  },
];

export const SelectSiteLang = () => {
  const { i18n } = useTranslation(['common']);
  const handleLangChange = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const lng = (e.target as HTMLButtonElement).value;
      i18n.changeLanguage(lng);
      localStorage('lng').set(lng);
    },
    [i18n]
  );

  return (
    <Select
      value={i18n.language}
      onChange={handleLangChange}
      options={langs.map((item) => ({
        label: (
          <TickerWrapper>
            <TickerFlag
              width="20"
              height="20"
              src={`/locales_flags/${item.flag}.svg`}
              alt={`${item.title} Language`}
            />
            {item.title}
          </TickerWrapper>
        ),
        value: item.code,
      }))}
    />
  );
};
