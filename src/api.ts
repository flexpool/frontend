import { fetchApi } from '@/utils/fetchApi';

export type LocateAddressResponse = {
  all: string[];
  error: string | null;
  pendingStats: boolean;
  result: string | null;
};

export const getLocateAddress = (address: string) => {
  return fetchApi<LocateAddressResponse>('/miner/locateAddress', {
    query: {
      address,
    },
    raw: true,
  });
};
