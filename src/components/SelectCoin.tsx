import React from 'react';
import { useDispatch } from 'react-redux';
import { localSettingsSet } from 'src/rdx/localSettings/localSettings.actions';
import { useReduxState } from 'src/rdx/useReduxState';
import styled from 'styled-components';
import { CoinLogo } from './CoinLogo';
import { Select, SelectOption } from './Form/Select/Select';
import DownshiftSelect from './Form/DownshiftSelect';
import usePoolCoinsQuery from '@/hooks/usePoolCoinsQuery';

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

/**
 * @deprecated A new implementation with Downshift is available.
 */
// export const SelectCoin = () => {
//   const localSettingsState = useReduxState('localSettings');
//   const poolCoinsState = useReduxState('poolCoins');
//   const d = useDispatch();

//   const options = React.useMemo(() => {
//     return (poolCoinsState.data?.coins || []).map((item) => ({
//       label: (
//         <LabelWrap>
//           <CoinLogo ticker={item.ticker} />
//           <CoinName>{item.name}</CoinName>
//           <CoinNameShort>{item.ticker}</CoinNameShort>
//         </LabelWrap>
//       ),
//       value: item.ticker,
//     }));
//   }, [poolCoinsState.data]);

//   const handleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
//     const value = (e.target as HTMLButtonElement).value;
//     d(
//       localSettingsSet({
//         coin: value,
//       })
//     );
//   };

//   return (
//     <Select
//       onChange={handleChange}
//       value={localSettingsState.coin || 'eth'}
//       options={options}
//     />
//   );
// };

export const NewSelectCoin = () => {
  const localSettingsState = useReduxState('localSettings');
  const { data: poolCoinsState } = usePoolCoinsQuery();
  const d = useDispatch();
  const [selected, setSelected] = React.useState<SelectOption | null>(null);

  const items = React.useMemo(() => {
    return (poolCoinsState?.coins || []).map((item) => ({
      label: (
        <LabelWrap>
          <CoinLogo ticker={item.ticker} />
          <CoinName>{item.name}</CoinName>
          <CoinNameShort>{item.ticker}</CoinNameShort>
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
