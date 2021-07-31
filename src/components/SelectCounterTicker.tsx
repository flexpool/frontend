import React from 'react';
import { useDispatch } from 'react-redux';
import { localSettingsSet } from 'src/rdx/localSettings/localSettings.actions';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { Ticker } from 'src/types/Ticker.types';
import { filterUnique } from 'src/utils/array.utils';
import styled from 'styled-components';
import { Select } from './Form/Select/Select';
import { Img } from './Img';

const TickerFlag = styled(Img)`
  height: 20px;
  margin-right: 0.5rem;
`;

const TickerWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const SelectCounterTicker = () => {
  const coinsState = useReduxState('poolCoins');
  const counterTicker = useCounterTicker();

  const counterTickers = React.useMemo(() => {
    const res = coinsState.data?.countervalues
      ? [...coinsState.data?.countervalues]
      : [];
    // add some more regardless the API
    res.push('sek');
    res.push('nzd');
    res.push('thb');
    return res.filter(filterUnique);
  }, [coinsState.data?.countervalues]);

  const d = useDispatch();

  const handleTickerChange = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      d(
        localSettingsSet({
          counterTicker: (e.target as HTMLButtonElement).value as Ticker,
        })
      );
    },
    [d]
  );

  return (
    <Select
      value={counterTicker}
      onChange={handleTickerChange}
      options={counterTickers.map((item) => ({
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
      }))}
    />
  );
};
