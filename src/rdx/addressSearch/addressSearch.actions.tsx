import { AddressCacheItem } from './addressSearch.reducer';

export const addressSearchSet = (item: AddressCacheItem) => ({
  type: '@addressCache/SET',
  payload: item,
});

export const addressSearchRemove = (address: AddressCacheItem['address']) => ({
  type: '@addressCache/REMOVE',
  payload: address,
});
