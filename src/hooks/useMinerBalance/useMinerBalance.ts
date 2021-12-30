import useMinerBalanceQuery from '../api/useMinerBalanceQuery';
import { useCounterTicker } from '@/rdx/localSettings/localSettings.hooks';

const useMinerBalance = (address?: string, coin?: string) => {
  const counterTicker = useCounterTicker();
  return useMinerBalanceQuery({ address, coin, countervalue: counterTicker });
};

export default useMinerBalance;
