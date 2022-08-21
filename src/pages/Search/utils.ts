import { getLocateAddress } from '@/api';
import { getChecksumByTicker } from '@/utils/validators/checksum';
import { AddressStatus } from '@/pages/Search/AddressCard';

export const getPropsFromLocateAddress = async (
  address: string | undefined
) => {
  let addressStatus: AddressStatus = 'not-found';
  let dashboards: string[] = [];
  let addressType: string | undefined = undefined;

  if (address) {
    const result = await getLocateAddress(address);

    if (getChecksumByTicker('eth')(address)) addressType = 'eth';
    if (getChecksumByTicker('xch')(address)) addressType = 'xch';

    const isPending = result.pendingStats === true;
    const isMining = !isPending && result.result !== null;

    if (isPending) {
      if (addressType === 'eth') dashboards = ['eth', 'etc'];
      if (addressType === 'xch') dashboards = ['xch'];
      addressStatus = 'pending';
    } else if (isMining) {
      dashboards = result.all;
      addressStatus = 'ready';
    }
  }

  return {
    dashboards,
    addressStatus,
    isAddressValid: addressType !== undefined,
  };
};
