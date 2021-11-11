import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { addressSearchSet } from 'src/rdx/addressSearch/addressSearch.actions';
import { getChecksumByTicker } from '@/utils/validators/checksum';

const useSearchAddress = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const search = useCallback(
    (address: string, coin?: string) => {
      let coinType = coin;

      if (!coin) {
        if (getChecksumByTicker('eth')(address)) coinType = 'eth';
        if (getChecksumByTicker('xch')(address)) coinType = 'xch';
      }

      if (!coinType) {
        alert('Please enter a valid Ethereum or Chia wallet address.');
        return false;
      }

      // Add to search history
      dispatch(
        addressSearchSet({
          coin: coinType,
          address: address,
        })
      );

      router.push(`/miner/${coinType}/${address}`, undefined, {
        // shallow routing is true if not on miner dashboard
        shallow: !router.query.address,
      });

      return true;
    },
    [dispatch, router]
  );

  return search;
};

export default useSearchAddress;
