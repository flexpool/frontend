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
  title: string;
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
  poolDetails: { key: string; value: string }[];
  hardware: MineableCoinHardware[];
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
    poolDetails: [
      { key: 'Reward Scheme', value: 'PPLNS (Pay Per Last N Shares)' },
      { key: 'Pool Fee', value: '0.5%' },
      { key: 'Bonuses', value: '90% of MEV bonus' },
      { key: 'Payout Round', value: 'Every 10 minutes' },
      { key: 'Payouts', value: 'from 0.01 ETH up to 100 ETH' },
      { key: 'Block confirmation time', value: '120 Blocks' },
      { key: 'Share Difficulty', value: '4 GH' },
      { key: 'Mining Algorithm', value: 'Ethash' },
    ],
    regions: [
      {
        domain: 'eth-us-east.flexpool.io',
        title: 'United States (East)',
        code: 'us-east',
        imageCode: 'us',
      },
      {
        domain: 'eth-us-west.flexpool.io',
        title: 'United States (West)',
        code: 'us-west',
        imageCode: 'us',
      },
      {
        domain: 'eth-de.flexpool.io',
        title: 'Germany',
        code: 'de',
        imageCode: 'de',
      },
      {
        domain: 'eth-se.flexpool.io',
        title: 'Sweden',
        code: 'se',
        imageCode: 'se',
      },
      {
        domain: 'eth-sg.flexpool.io',
        title: 'Singapore',
        code: 'sg',
        imageCode: 'sg',
      },
      {
        domain: 'eth-au.flexpool.io',
        title: 'Australia',
        code: 'au',
        imageCode: 'au',
      },
      {
        domain: 'eth-br.flexpool.io',
        title: 'Brazil',
        code: 'br',
        imageCode: 'br',
      },
    ],
    hardware: [
      {
        title: 'GPU Mining Rig',
        key: 'GPU',
        miners: [
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'TeamRedMiner',
            key: 'teamreadminer',
            description: 'Best miner for AMD GPUs',
            fee: [0.75, 1],
            compatibleGpus: ['AMD'],
            downloadLink: 'https://github.com/todxx/teamredminer/releases',
            cmd:
              'teamredminer.exe -a ethash -o stratum+ssl://CLOSEST_SERVER:5555 -u WALLET_ADDRESS.WORKER_NAME -p x --eth_stratum ethproxy',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'T-Rex Miner',
            key: 'trexminer',
            description: 'Best miner for NVIDIA 20/30 Series GPUs',
            fee: [1],
            compatibleGpus: ['NVIDIA'],
            downloadLink: 'https://github.com/trexminer/T-Rex/releases',
            cmd:
              't-rex.exe -a ethash -o stratum+ssl://CLOSEST_SERVER:5555 -u WALLET_ADDRESS -p x -w WORKER_NAME',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'lolminer',
            key: 'lolminer',
            description: 'Best miner for 4GB zombie mode.',
            fee: [0.75],
            compatibleGpus: ['AMD', 'NVIDIA'],
            downloadLink:
              'https://github.com/Lolliedieb/lolMiner-releases/releases',
            cmd:
              'lolMiner.exe --algo ETHASH --pool stratum+ssl://CLOSEST_SERVER:5555 --user WALLET_ADDRESS.WORKER_NAME',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'ethminer',
            key: 'ethminer',
            description:
              'Open-source ethash miner with no fees. Brought by Ethereum community.',
            fee: [0],
            compatibleGpus: ['AMD', 'NVIDIA'],
            downloadLink:
              'https://github.com/ethereum-mining/ethminer/releases',
            cmd:
              'ethminer.exe -R -P stratum1+ssl://WALLET_ADDRESS.WORKER_NAME@CLOSEST_SERVER:5555',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'PhoenixMiner',
            key: 'phoenixminer',
            description: 'Proprietary Ethash miner with the lowest devfee.',
            fee: [0.65],
            compatibleGpus: ['AMD', 'NVIDIA'],
            downloadLink:
              'https://github.com/PhoenixMinerDevTeam/PhoenixMiner/releases',
            cmd:
              'PhoenixMiner.exe -pool ssl://CLOSEST_SERVER:5555 -wal WALLET_ADDRESS.WORKER_NAME',
          },
        ],
      },
    ],
  },
];
