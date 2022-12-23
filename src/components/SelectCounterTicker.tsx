import React from 'react';
import { useDispatch } from 'react-redux';
import { localSettingsSet } from 'src/rdx/localSettings/localSettings.actions';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { Ticker } from 'src/types/Ticker.types';
import styled from 'styled-components';
import { SelectOption } from './Form/Select/Select';
import { SelectCombobox } from './Form/SelectCombobox';
import usePoolCoinsQuery from '@/hooks/api/usePoolCoinsQuery';
import { uniq } from 'lodash';

import { Img } from './Img';

const CURRENCIES = [
  'aed',
  'ars',
  'aud',
  'bdt',
  'bhd',
  'bmd',
  'brl',
  'cad',
  'chf',
  'clp',
  'cny',
  'czk',
  'dkk',
  'eur',
  'gbp',
  'hkd',
  'huf',
  'ils',
  'inr',
  'jpy',
  'krw',
  'kwd',
  'lkr',
  'mmk',
  'mxn',
  'myr',
  'ngn',
  'nok',
  'nzd',
  'php',
  'pkr',
  'pln',
  'rub',
  'sar',
  'sek',
  'sgd',
  'thb',
  'try',
  'twd',
  'uah',
  'usd',
  'vef',
  'vnd',
  'zar',
  'lambo',
];

const TickerFlag = styled(Img)`
  height: 20px;
  margin-right: 0.5rem;
`;

const TickerWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const NewSelectCounterTicker = () => {
  const { data: poolCoins } = usePoolCoinsQuery();
  const counterTicker = useCounterTicker();
  const d = useDispatch();
  const [selected, setSelected] = React.useState<SelectOption | null>(null);

  const items = React.useMemo(() => {
    const currencyOptions = poolCoins?.countervalues
      ? uniq([...poolCoins.countervalues, ...CURRENCIES])
      : [];

    return currencyOptions.map((item) => ({
      label: (
        <TickerWrapper>
          <TickerFlag
            width="20"
            height="20"
            src={`https://static.flexpool.io/assets/countervalues/${item}.svg`}
            alt={`${item.toUpperCase()} Currency Flag`}
          />
          {item.toUpperCase()}
        </TickerWrapper>
      ),
      value: item,
    }));
  }, [poolCoins]);

  React.useEffect(() => {
    if (items.length && counterTicker) {
      setSelected(
        items.find((item) => item.value === counterTicker) || items[0] || null
      );
    }
  }, [items, setSelected, counterTicker]);

  return (
    <SelectCombobox
      selectedItem={selected}
      items={items}
      onSelectedItemChange={(changes) => {
        if (changes.selectedItem) {
          setSelected(changes.selectedItem);
          d(
            localSettingsSet({
              counterTicker: changes.selectedItem.value as Ticker,
            })
          );
        }
      }}
    />
  );
};
