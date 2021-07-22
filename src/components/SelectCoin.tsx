import React from 'react';
import { useDispatch } from 'react-redux';
import { localSettingsSet } from 'src/rdx/localSettings/localSettings.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import styled from 'styled-components';
import { CoinLogo } from './CoinLogo';
import { Select } from './Form/Select/Select';

const LabelWrap = styled.div`
  display: flex;
  align-items: center;
`;

const CoinNameShort = styled.span`
  text-transform: uppercase;
  display: none;
  @media screen and (max-width: 560px) {
    display: inline;
  }
  margin-left: 5px;
`;
const CoinName = styled.span`
  @media screen and (max-width: 560px) {
    display: none;
  }
  margin-left: 10px;
`;

export const SelectCoin = () => {
  const localSettingsState = useReduxState('localSettings');
  const poolCoinsState = useReduxState('poolCoins');
  const d = useDispatch();

  const options = React.useMemo(() => {
    return (poolCoinsState.data?.coins || []).map((item) => ({
      label: (
        <LabelWrap>
          <CoinLogo ticker={item.ticker} />
          <CoinName>{item.name}</CoinName>
          <CoinNameShort>{item.ticker}</CoinNameShort>
        </LabelWrap>
      ),
      value: item.ticker,
    }));
  }, [poolCoinsState.data]);

  const handleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = (e.target as HTMLButtonElement).value;
    console.log(e.target as HTMLButtonElement);
    d(
      localSettingsSet({
        coin: value,
      })
    );
  };

  return (
    <Select
      onChange={handleChange}
      value={localSettingsState.coin || 'eth'}
      options={options}
    />
  );
};
