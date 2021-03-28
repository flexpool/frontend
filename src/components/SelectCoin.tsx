import React from 'react';
import { useDispatch } from 'react-redux';
import { localSettingsSet } from 'src/rdx/localSettings/localSettings.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import styled from 'styled-components/macro';
import { Select } from './Form/Select/Select';

const CoinLogo = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
`;
const LabelWrap = styled.div`
  display: flex;
  align-items: center;
`;

export const SelectCoin = () => {
  const localSettingsState = useReduxState('localSettings');
  const poolCoinsState = useReduxState('poolCoins');
  const d = useDispatch();

  const options = React.useMemo(() => {
    return (poolCoinsState.data?.coins || []).map((item) => ({
      label: (
        <LabelWrap>
          <CoinLogo
            src={`https://static.flexpool.io/assets/coinLogos/thumb/${item.ticker}.png`}
            alt={`${item.name} Logo`}
          />
          {item.name}
        </LabelWrap>
      ),
      value: item.ticker,
    }));
  }, [poolCoinsState.data]);

  const handleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = (e.target as HTMLButtonElement).value;
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
