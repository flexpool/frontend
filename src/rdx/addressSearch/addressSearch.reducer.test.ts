import { reducer } from './addressSearch.reducer';
import { addressSearchSet } from './addressSearch.actions';

describe('addressSearch reducer should handle items being added to the list', () => {
  it('should handle single item', () => {
    expect(
      reducer(
        undefined,
        addressSearchSet({
          address: 'address_0',
          coin: 'eth',
        })
      )
    ).toEqual([
      {
        address: 'address_0',
        coin: 'eth',
      },
    ]);
  });

  it('should handle multiple items', () => {
    expect(
      reducer(
        [
          {
            address: 'address_0',
            coin: 'eth',
          },
          {
            address: 'address_1',
            coin: 'eth',
          },
        ],
        addressSearchSet({
          address: 'address_1',
          coin: 'eth',
        })
      )
    ).toEqual([
      {
        address: 'address_1',
        coin: 'eth',
      },
      {
        address: 'address_0',
        coin: 'eth',
      },
    ]);
  });

  it('should handle complex item', () => {
    expect(
      reducer(
        [
          {
            address: 'address_0',
            coin: 'eth',
          },
          {
            address: 'address_1',
            coin: null,
          },
        ],
        addressSearchSet({
          address: 'address_1',
          coin: ['eth', 'etc'],
        })
      )
    ).toEqual([
      {
        address: 'address_1',
        coin: ['eth', 'etc'],
      },
      {
        address: 'address_0',
        coin: 'eth',
      },
    ]);
  });
});
