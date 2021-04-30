import React from 'react';
import styled from 'styled-components/macro';
import { Select } from './Form/Select/Select';
import { Img } from './Img';
import { useTranslation } from 'react-i18next';
import { localStorage } from 'src/utils/localStorage';
import { availableLangs } from 'src/i18n-select-lang';

const TickerFlag = styled(Img)`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
`;

const TickerWrapper = styled.div`
  display: flex;
  align-items: center;
`;
export const SelectLanguage = () => {
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
      options={availableLangs.map((item) => ({
        label: (
          <TickerWrapper>
            <TickerFlag
              width="20"
              height="20"
              src={`https://static.flexpool.io/assets/countries/${item.flag}.svg`}
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
