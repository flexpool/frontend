import { localStorage } from 'src/utils/localStorage';

export const searchAddressStorage = localStorage<
  { coin: string; address: string }[]
>('address_cache', {
  defaultValue: [],
});

export const saveAddressToCache = (coin: string, address: string) => {
  const data = (searchAddressStorage.get() || [])
    // remove previous save
    .filter((item) => item.address !== address);
  const next = [{ coin, address }, ...data];
  // save
  console.log(next);
  searchAddressStorage.set(next);
};
