import { checksumEth } from 'src/utils/validators/ethWalletAddress.validator';

export type GpuHardwareDetails = {
  os: ('linux' | 'windows' | 'hiveos')[];
  title: string;
  key: string;
  description: string;
  fee: [number] | [number, number];
  compatibleGpus: string[];
  downloadLink: string;
  cmd: string;
};
export type MineableCoinRegion = {
  domain: string;
  code: string;
  imageCode: string;
};

export type MineableCoinHardware = {
  title: string;
  key: 'GPU';
  miners: GpuHardwareDetails[];
};

export type MineableCoin = {
  name: string;
  ticker: string;
  algorithm: string;
  regions: MineableCoinRegion[];
  description: string;
  walletAddressExample: string;
  regex: RegExp;
  validator: (address: string) => null | string;
};

export const mineableCoins: MineableCoin[] = [
  {
    name: 'Ethereum',
    ticker: 'eth',
    algorithm: 'Ethash',
    description: '',
    regex: /^0x[a-fA-F0-9]{40}$/g,
    validator: checksumEth,
    walletAddressExample: '0xBf08F613ccE234c96e0e889a0B660bD819D23795',
    regions: [
      {
        domain: 'eth-us-east.flexpool.io',
        code: 'us-east',
        imageCode: 'us',
      },
      {
        domain: 'eth-us-west.flexpool.io',
        code: 'us-west',
        imageCode: 'us',
      },
      {
        domain: 'eth-de.flexpool.io',
        code: 'de',
        imageCode: 'de',
      },
      {
        domain: 'eth-se.flexpool.io',
        code: 'se',
        imageCode: 'se',
      },
      {
        domain: 'eth-sg.flexpool.io',
        code: 'sg',
        imageCode: 'sg',
      },
      {
        domain: 'eth-au.flexpool.io',
        code: 'au',
        imageCode: 'au',
      },
      {
        domain: 'eth-br.flexpool.io',
        code: 'br',
        imageCode: 'br',
      },
      {
        domain: 'eth-kr.flexpool.io',
        code: 'kr',
        imageCode: 'kr',
      },
    ],
  },
];
