import { localStorage } from 'src/utils/localStorage';

export const searchAddressStorage = localStorage<
  { coin: string; address: string }[]
>('address_cache', {
  defaultValue: [],
});
