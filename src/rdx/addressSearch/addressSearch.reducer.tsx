import { AnyAction, Reducer } from 'redux';
import { searchAddressStorage } from 'src/components/SearchAddressBar/searchCache';

export type AddressCacheItem = {
  coin: string;
  address: string;
};

export const initialState: AddressCacheItem[] = [];

export const reducer: Reducer<AddressCacheItem[], AnyAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case '@addressCache/SET': {
      const nextItem = action.payload as AddressCacheItem;
      const nextData = state.filter(
        (item) => item.address !== nextItem.address
      );
      const nextState = [nextItem, ...nextData];
      searchAddressStorage.set(nextState);
      return nextState;
    }
    case '@addressCache/REMOVE': {
      const addressToRemove = action.payload as AddressCacheItem['address'];
      const nextState = state.filter(
        (item) => item.address !== addressToRemove
      );
      searchAddressStorage.set(nextState);
      return nextState;
    }
  }

  return state;
};
