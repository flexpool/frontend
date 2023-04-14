import React from 'react';
import { useDispatch } from 'react-redux';
import { localSettingsSet } from 'src/rdx/localSettings/localSettings.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import styled from 'styled-components';
import { CoinLogo } from './CoinLogo';
import { processTicker } from '@/utils/ticker';
import { Select, SelectOption } from './Form/Select/Select';
import DownshiftSelect from './Form/DownshiftSelect';
import usePoolCoinsQuery from '@/hooks/api/usePoolCoinsQuery';

const LabelWrap = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

const CoinNameShort = styled.span`
  display: none;
  @media screen and (max-width: 560px) {
    display: inline;
  }
  margin-left: 5px;
`;

const TestnetBadge = styled.span`
  text-transform: uppercase;
  margin-left: 5px;
  opacity: 0.5;
`;

const CoinName = styled.span`
  display: flex;
  align-items: center;
  @media screen and (max-width: 560px) {
    display: none;
  }
  margin-left: 10px;
`;

export const NewSelectCoin = () => {
  const localSettingsState = useReduxState('localSettings');
  const { data: poolCoinsState } = usePoolCoinsQuery();
  const d = useDispatch();
  const [selected, setSelected] = React.useState<SelectOption | null>(null);

  const items = React.useMemo(() => {
    return (poolCoinsState?.coins || [])
      .filter((c) => !c.payoutsOnly)
      .map((item) => ({
        label: (
          <LabelWrap>
            <CoinLogo ticker={item.ticker} />
            <CoinName>
              {item.name}
              {item.testnet && <TestnetBadge>(Testnet)</TestnetBadge>}
            </CoinName>
            <CoinNameShort>
              {processTicker(item.ticker, item.testnet)}
            </CoinNameShort>
          </LabelWrap>
        ),
        value: item.ticker,
      }));
  }, [poolCoinsState]);

  React.useEffect(() => {
    const selectedCoin = localSettingsState.coin || 'eth';

    if (localSettingsState.coin) {
      setSelected(items.find((item) => item.value === selectedCoin) || null);
    }
  }, [localSettingsState.coin, items, setSelected]);

  return (
    <DownshiftSelect
      items={items}
      selectedItem={selected}
      onSelectedItemChange={(changes) => {
        d(
          localSettingsSet({
            coin: changes.selectedItem?.value,
          })
        );
      }}
    />
  );
};
