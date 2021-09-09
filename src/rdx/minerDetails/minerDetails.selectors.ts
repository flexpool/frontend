import { useSelector } from 'react-redux';
import { AppState } from '../rootReducer';

export const useMinerDetail = () =>
  useSelector((state: AppState) => state.minerDetails);

export const useNetworkFeeLimit = () => {
  const minerDetail = useMinerDetail();
  const fee = minerDetail.data?.maxFeePrice;
  if (fee === 0) return Infinity;
  return fee;
};
