import { getPropsFromLocateAddress } from './utils';
const mockGetLocateAddress = jest.fn();

jest.mock('@/api', () => {
  return {
    getLocateAddress: () => mockGetLocateAddress(),
  };
});

describe('getPropsFromLocateAddress', () => {
  it('handles correctly for incorrect address format', async () => {
    mockGetLocateAddress.mockResolvedValue({
      pendingStats: false,
      result: null,
      all: [],
    });

    const { dashboards, addressStatus, isAddressValid } =
      await getPropsFromLocateAddress('0x0');

    expect(dashboards).toEqual([]);
    expect(addressStatus).toEqual('not-found');
    expect(isAddressValid).toEqual(false);
  });

  it('handles correctly for wallet mining only ethereum', async () => {
    mockGetLocateAddress.mockResolvedValue({
      pendingStats: false,
      result: 'eth',
      all: ['eth'],
    });

    const { dashboards, addressStatus, isAddressValid } =
      await getPropsFromLocateAddress(
        '0xb794f5ea0ba39494ce839613fffba74279579268'
      );

    expect(dashboards).toEqual(['eth']);
    expect(addressStatus).toEqual('ready');
    expect(isAddressValid).toEqual(true);
  });

  it('handles correctly for wallet mining only chia', async () => {
    mockGetLocateAddress.mockResolvedValue({
      pendingStats: false,
      result: 'xch',
      all: ['xch'],
    });

    const { dashboards, addressStatus, isAddressValid } =
      await getPropsFromLocateAddress(
        'xch1ch36xj8vtc2yr72f95u7nr36ykdtfsz0l2cannpskr6n46m6m2zsh8husq'
      );

    expect(dashboards).toEqual(['xch']);
    expect(addressStatus).toEqual('ready');
    expect(isAddressValid).toEqual(true);
  });

  it('handles correctly for wallet mining only etc', async () => {
    mockGetLocateAddress.mockResolvedValue({
      pendingStats: false,
      result: 'etc',
      all: ['etc'],
    });

    const { dashboards, addressStatus, isAddressValid } =
      await getPropsFromLocateAddress(
        'xch1ch36xj8vtc2yr72f95u7nr36ykdtfsz0l2cannpskr6n46m6m2zsh8husq'
      );

    expect(dashboards).toEqual(['etc']);
    expect(addressStatus).toEqual('ready');
    expect(isAddressValid).toEqual(true);
  });

  it('handles correctly for wallet mining both eth and etc', async () => {
    mockGetLocateAddress.mockResolvedValue({
      pendingStats: false,
      result: 'eth',
      all: ['eth', 'etc'],
    });

    const { dashboards, addressStatus, isAddressValid } =
      await getPropsFromLocateAddress(
        '0xb794f5ea0ba39494ce839613fffba74279579268'
      );

    expect(dashboards).toEqual(['eth', 'etc']);
    expect(addressStatus).toEqual('ready');
    expect(isAddressValid).toEqual(true);
  });

  it('handles correctly for pending eth wallet ', async () => {
    mockGetLocateAddress.mockResolvedValue({
      pendingStats: true,
      result: null,
      all: [],
    });

    const { dashboards, addressStatus, isAddressValid } =
      await getPropsFromLocateAddress(
        '0xb794f5ea0ba39494ce839613fffba74279579268'
      );

    expect(dashboards).toEqual(['eth', 'etc']);
    expect(addressStatus).toEqual('pending');
    expect(isAddressValid).toEqual(true);
  });

  it('handles correctly for pending xch wallet ', async () => {
    mockGetLocateAddress.mockResolvedValue({
      pendingStats: true,
      result: null,
      all: [],
    });

    const { dashboards, addressStatus, isAddressValid } =
      await getPropsFromLocateAddress(
        'xch1ch36xj8vtc2yr72f95u7nr36ykdtfsz0l2cannpskr6n46m6m2zsh8husq'
      );

    expect(dashboards).toEqual(['xch']);
    expect(addressStatus).toEqual('pending');
    expect(isAddressValid).toEqual(true);
  });
});
