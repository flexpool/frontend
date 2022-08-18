import { localStorage } from 'src/utils/localStorage';

export type AddressCacheItem = {
  coin: string | string[] | null;
  address: string;
};

export const searchAddressStorage = localStorage<AddressCacheItem[]>(
  'address_cache',
  {
    defaultValue: [],
  }
);
