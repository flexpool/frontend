import { useRouter } from 'next/router';
import { getLocateAddress } from '@/api';
import { useDispatch } from 'react-redux';
import { addressSearchSet } from 'src/rdx/addressSearch/addressSearch.actions';
import { AddressCacheItem } from '@/components/SearchAddressBar/searchCache';
import NProgress from 'nprogress';

const NOOP = () => {};

const useSearchAddress = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const search = async (
    address: string,
    coin?: AddressCacheItem['coin'],
    callback = NOOP
  ) => {
    // Start NProgress right away for better feedback
    NProgress.start();

    if (coin && !Array.isArray(coin)) {
      router.push(`/miner/${coin}/${address}`).then(() => {
        callback();
        dispatch(
          addressSearchSet({
            coin,
            address: address,
          })
        );
      });
    } else {
      const result = await getLocateAddress(address);

      if (result.all.length === 1) {
        router.push(`/miner/${result.all[0]}/${address}`).then(() => {
          callback();
          dispatch(
            addressSearchSet({
              coin: result.all[0],
              address: address,
            })
          );
        });
      } else {
        router
          .push(
            {
              pathname: '/search',
              query: {
                search: address,
              },
            },
            undefined,
            { shallow: false }
          )
          .then(() => {
            callback();
            dispatch(
              addressSearchSet({
                coin: result.all,
                address: address,
              })
            );
          });
      }
    }
  };

  return search;
};

export default useSearchAddress;
