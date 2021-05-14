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
  high_diff_avail?: boolean;
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
  nicehash_algorithm: string;
  regions: MineableCoinRegion[];
  description: string;
  walletAddressExample: string;
  regex: RegExp;
  validator: (address: string) => null | string;
  hardware: MineableCoinHardware[];
};

export const mineableCoins: MineableCoin[] = [
  {
    name: 'Ethereum',
    ticker: 'eth',
    algorithm: 'Ethash',
    nicehash_algorithm: 'DaggerHashimoto',
    description: '',
    regex: /^0x[a-fA-F0-9]{40}$/g,
    validator: checksumEth,
    walletAddressExample: '0xBf08F613ccE234c96e0e889a0B660bD819D23795',
    regions: [
      {
        domain: 'eth-us-east.flexpool.io',
        code: 'us-east',
        imageCode: 'us',
        high_diff_avail: true,
      },
      {
        domain: 'eth-us-west.flexpool.io',
        code: 'us-west',
        imageCode: 'us',
        high_diff_avail: true,
      },
      {
        domain: 'eth-de.flexpool.io',
        code: 'de',
        imageCode: 'de',
        high_diff_avail: true,
      },
      {
        domain: 'eth-se.flexpool.io',
        code: 'se',
        imageCode: 'se',
        high_diff_avail: true,
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
              'teamredminer.exe -a ethash -o stratum+ssl://CLOSEST_SERVER:5555 -u WALLET_ADDRESS.WORKER_NAME -o stratum+ssl://BACKUP_SERVER:5555 -u WALLET_ADDRESS.WORKER_NAME -p x --eth_stratum ethproxy',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'T-Rex Miner',
            key: 'trexminer',
            description: 'Best miner for NVIDIA 20/30 Series GPUs',
            fee: [1],
            compatibleGpus: ['NVIDIA'],
            downloadLink: 'https://trex-miner.com/',
            cmd:
              't-rex.exe -a ethash -o stratum+ssl://CLOSEST_SERVER:5555 -o stratum+ssl://BACKUP_SERVER:5555 -u WALLET_ADDRESS -p x -w WORKER_NAME',
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
              'lolMiner.exe --algo ETHASH --pool stratum+ssl://CLOSEST_SERVER:5555 --user WALLET_ADDRESS.WORKER_NAME  --pool stratum+ssl://BACKUP_SERVER:5555 --user WALLET_ADDRESS.WORKER_NAME',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'PhoenixMiner',
            key: 'phoenixminer',
            description: 'Proprietary Ethash miner with low devfee.',
            fee: [0.65],
            compatibleGpus: ['AMD', 'NVIDIA'],
            downloadLink: 'https://phoenixminer.info/downloads/',
            cmd:
              'PhoenixMiner.exe -pool ssl://CLOSEST_SERVER:5555 -pool2 ssl://BACKUP_SERVER:5555 -wal WALLET_ADDRESS.WORKER_NAME',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'GMiner',
            key: 'gminer',
            description:
              'Actively developed and stable miner with low dev fee.',
            compatibleGpus: ['AMD', 'NVIDIA'],
            fee: [0.65],
            downloadLink:
              'https://github.com/develsoftware/GMinerRelease/releases',
            cmd:
              'miner.exe -a eth --ssl 1 -s CLOSEST_SERVER:5555 -u WALLET_ADDRESS.WORKER_NAME --ssl 1 -s BACKUP_SERVER:5555 -u WALLET_ADDRESS.WORKER_NAME',
          },
        ],
      },
    ],
  },
];
