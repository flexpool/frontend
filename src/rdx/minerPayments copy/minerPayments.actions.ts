import { ApiMinerPayments } from 'src/types/Miner.types';
import { fetchApi } from 'src/utils/fetchApi';

export const minerPaymentsGet = (
  coin: string,
  address: string,
  countervalue: string,
  page: number
) => {
  const init = { query: { coin, address, countervalue, page } };

  return {
    type: '@minerPayments/GET',
    payload: fetchApi<ApiMinerPayments>('/miner/payments', init),
  };
};
