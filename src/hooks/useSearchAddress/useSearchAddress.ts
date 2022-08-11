import { useRouter } from 'next/router';

const NOOP = () => {};

const useSearchAddress = () => {
  const router = useRouter();

  const search = (address: string, coin?: string, callback = NOOP) => {
    if (coin) {
      router.push(`/miner/${coin}/${address}?fromSearch=true`).then(() => {
        callback();
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
        });
    }
  };

  return search;
};

export default useSearchAddress;
