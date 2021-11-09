import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { fetchApi } from '@/utils/fetchApi';
import { addressSearchSet } from 'src/rdx/addressSearch/addressSearch.actions';
import { getChecksumByTicker } from '@/utils/validators/checksum';

type LocateAddressResponse = string | null;

type useSearchAddressProps = {
  onSuccess: (coin: LocateAddressResponse, address: string) => void;
};

const useSearchAddress = ({ onSuccess }: useSearchAddressProps) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const search = useCallback(
    async (address: string) => {
      try {
        let coin = await queryClient.fetchQuery(
          ['/miner/locateAddress', { address }] as const,
          ({ queryKey }) =>
            fetchApi<LocateAddressResponse>(queryKey[0], {
              query: queryKey[1],
            }),
          {
            staleTime: 60 * 1000, // 1 minute
          }
        );

        if (!coin) {
          // guess address type
          if (getChecksumByTicker('eth')(address)) {
            coin = 'eth';
          } else if (getChecksumByTicker('xch')(address)) {
            coin = 'xch';
          }
        }

        if (!coin) {
          alert('Please enter a valid address');
          return;
        }

        // Add to search history
        if (coin && address) {
          dispatch(
            addressSearchSet({
              coin,
              address: address,
            })
          );

          onSuccess && onSuccess(coin, address);
        }
      } catch (error) {}
    },
    [queryClient, dispatch, onSuccess]
  );

  return search;
};

export default useSearchAddress;
