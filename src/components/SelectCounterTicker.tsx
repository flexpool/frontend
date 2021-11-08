import React from 'react';
import { useDispatch } from 'react-redux';
import { localSettingsSet } from 'src/rdx/localSettings/localSettings.actions';
import { useCounterTicker } from 'src/rdx/localSettings/localSettings.hooks';
import { useReduxState } from 'src/rdx/useReduxState';
import { Ticker } from 'src/types/Ticker.types';
import { filterUnique } from 'src/utils/array.utils';
import styled from 'styled-components';
import { Select, SelectOption } from './Form/Select/Select';
import DownshiftSelect from './Form/DownshiftSelect';
import usePoolCoinsQuery from '@/hooks/usePoolCoinsQuery';

import { Img } from './Img';

const TickerFlag = styled(Img)`
  height: 20px;
  margin-right: 0.5rem;
`;

const TickerWrapper = styled.div`
  display: flex;
  align-items: center;
`;

/**
 * @deprecated A new implementation with Downshift is available.
 */
// export const SelectCounterTicker = () => {
//   const coinsState = useReduxState('poolCoins');
//   const counterTicker = useCounterTicker();

//   const counterTickers = React.useMemo(() => {
//     const res = coinsState.data?.countervalues
//       ? [...coinsState.data?.countervalues]
//       : [];
//     // add some more regardless the API
//     res.push('sek');
//     res.push('nzd');
//     res.push('thb');
//     return res.filter(filterUnique);
//   }, [coinsState.data?.countervalues]);

//   const d = useDispatch();

//   const handleTickerChange = React.useCallback(
//     (e: React.MouseEvent<HTMLButtonElement>) => {
//       d(
//         localSettingsSet({
//           counterTicker: (e.target as HTMLButtonElement).value as Ticker,
//         })
//       );
//     },
//     [d]
//   );

//   return (
//     <Select
//       value={counterTicker}
//       onChange={handleTickerChange}
//       options={counterTickers.map((item) => ({
//         label: (
//           <TickerWrapper>
//             <TickerFlag
//               width="20"
//               height="20"
//               src={`https://static.flexpool.io/assets/countervalues/${item}.svg`}
//               alt={`${item.toUpperCase()} Currency Flag`}
//             />
//             {item.toUpperCase()}
//           </TickerWrapper>
//         ),
//         value: item,
//       }))}
//     />
//   );
// };

export const NewSelectCounterTicker = () => {
  const { data: poolCoins } = usePoolCoinsQuery();
  const counterTicker = useCounterTicker();
  const d = useDispatch();
  const [selected, setSelected] = React.useState<SelectOption | null>(null);

  const items = React.useMemo(() => {
    const currencyOptions = poolCoins?.countervalues
      ? [...poolCoins.countervalues, 'sek', 'nzd', 'thb', 'pln']
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
    <DownshiftSelect
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
