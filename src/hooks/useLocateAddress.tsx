import React, { useEffect } from 'react';
import { useAsyncState } from 'src/hooks/useAsyncState';
import { fetchApi } from 'src/utils/fetchApi';
import { localSettingsSet } from 'src/rdx/localSettings/localSettings.actions';

type addressConfig = {
  address: string;
  coinTicker: string;
};

const useLocateAddress = ({ address, coinTicker }: addressConfig) => {
  const locateAddressState = useAsyncState<string | null>();

  useEffect(() => {
    locateAddressState.start(
      fetchApi<string | null>('/miner/locateAddress', {
        query: { address },
      }).then((res) => {
        if (res !== coinTicker) {
          return Promise.reject({
            message: 'Address not found',
          });
        }
        localSettingsSet({ coin: res });
        return res;
      })
    );
    // eslint-disable-next-line
  }, [coinTicker, address]);

  return locateAddressState;
};

export default useLocateAddress;
