import { btcAddressValidator } from '@/utils/validators/btcWalletAddress';
import { checksumIron } from '@/utils/validators/ironWalletAddress.validator';
import { checksumETH } from 'src/utils/validators/ethWalletAddress.validator';
import { checksumXCH } from 'src/utils/validators/xchWalletAddress.validator';

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
  key: string;
  miners: null | GpuHardwareDetails[];
};

export type MineableCoin = {
  name: string;
  ticker: string;
  algorithm: string;
  nicehash_algorithm: null | string;
  regions: MineableCoinRegion[];
  configs?: Configs;
  description: string;
  walletAddressExample: string;
  regex: RegExp;
  validator: (
    address: string,
    input?: (addr: string) => string | null
  ) => null | string;
  hardware: MineableCoinHardware[];
  nicehashAvailable: boolean;
};

type Configs = {
  showBlocksRegion?: boolean;
};

export const mineableCoins: MineableCoin[] = [
  {
    name: 'Ethereum Classic',
    ticker: 'etc',
    algorithm: 'Etchash',
    nicehash_algorithm: 'DaggerHashimoto',
    description: '',
    regex: /^0x[a-fA-F0-9]{40}$/g,
    validator: checksumETH,
    walletAddressExample: '0xBf08F613ccE234c96e0e889a0B660bD819D23795',
    nicehashAvailable: true,
    configs: {
      showBlocksRegion: true,
    },
    regions: [
      {
        domain: 'etc-us-east.flexpool.io',
        code: 'us-east',
        imageCode: 'us',
        high_diff_avail: true,
      },
      {
        domain: 'etc-de.flexpool.io',
        code: 'de',
        imageCode: 'de',
        high_diff_avail: true,
      },
      {
        domain: 'etc-sg.flexpool.io',
        code: 'sg',
        imageCode: 'sg',
        high_diff_avail: true,
      },
      {
        domain: 'sgeetc.gfwroute.co',
        code: 'sge',
        imageCode: 'cn',
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
            description: '',
            fee: [0.75, 1],
            compatibleGpus: ['AMD'],
            downloadLink: 'https://github.com/todxx/teamredminer/releases',
            cmd: 'teamredminer.exe -a etchash -o stratum+ssl://CLOSEST_SERVER:5555 -u WALLET_ADDRESS.WORKER_NAME -o stratum+ssl://BACKUP_SERVER:5555 -u WALLET_ADDRESS.WORKER_NAME -p x --eth_stratum ethproxy',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'T-Rex Miner',
            key: 'trexminer',
            description: '',
            fee: [1],
            compatibleGpus: ['NVIDIA'],
            downloadLink: 'https://trex-miner.com/',
            cmd: 't-rex.exe -a etchash -o stratum+ssl://CLOSEST_SERVER:5555 -o stratum+ssl://BACKUP_SERVER:5555 -u WALLET_ADDRESS -p x -w WORKER_NAME',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'lolMiner',
            key: 'lolminer',
            description: '',
            fee: [0.75],
            compatibleGpus: ['AMD', 'NVIDIA'],
            downloadLink:
              'https://github.com/Lolliedieb/lolMiner-releases/releases',
            cmd: 'lolMiner.exe --algo ETCHASH --pool stratum+ssl://CLOSEST_SERVER:5555 --user WALLET_ADDRESS.WORKER_NAME  --pool stratum+ssl://BACKUP_SERVER:5555 --user WALLET_ADDRESS.WORKER_NAME',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'PhoenixMiner',
            key: 'phoenixminer',
            description: '',
            fee: [0.65],
            compatibleGpus: ['AMD', 'NVIDIA'],
            downloadLink: 'https://phoenixminer.info/downloads/',
            cmd: 'PhoenixMiner.exe -pool ssl://CLOSEST_SERVER:5555 -pool2 ssl://BACKUP_SERVER:5555 -wal WALLET_ADDRESS.WORKER_NAME',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'GMiner',
            key: 'gminer',
            description: '',
            compatibleGpus: ['AMD', 'NVIDIA'],
            fee: [1],
            downloadLink:
              'https://github.com/develsoftware/GMinerRelease/releases',
            cmd: 'miner.exe -a etc --ssl 1 -s CLOSEST_SERVER:5555 -u WALLET_ADDRESS.WORKER_NAME --ssl 1 -s BACKUP_SERVER:5555 -u WALLET_ADDRESS.WORKER_NAME',
          },
        ],
      },
    ],
  },
  {
    name: 'Chia',
    ticker: 'xch',
    algorithm: 'Chia PoST',
    nicehash_algorithm: null,
    description: '',
    regex: /^(t|)xch1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58}$/g,
    validator: btcAddressValidator(checksumXCH),
    walletAddressExample:
      'xch1442zglfj9y8jvr9hnle7p09s0ura4vwnxfl7cfp4eud99f0hr2aqfvdl0h',
    nicehashAvailable: false,
    regions: [
      {
        domain: 'xch-de.flexpool.io',
        code: 'de',
        imageCode: 'de',
      },
      {
        domain: 'xch-us.flexpool.io',
        code: 'us',
        imageCode: 'us',
      },
      {
        domain: 'xch-sg.flexpool.io',
        code: 'sg',
        imageCode: 'sg',
      },
    ],
    hardware: [
      {
        title: 'Chia CLI Farming',
        key: 'CLI',
        miners: null,
      },
    ],
  },
  {
    name: 'Iron Fish',
    ticker: 'iron',
    algorithm: 'Blake3',
    nicehash_algorithm: null,
    description: '',
    regex: /^[A-Fa-f0-9]{64}(\+[a-zA-Z0-9]{1,32})?$/,
    validator: btcAddressValidator(checksumIron),
    walletAddressExample:
      '2aa206fcbe1d1d86b3db2ec6e80aae6c181f633b42e4df02a8e7997f0f59c4dd',
    nicehashAvailable: false,
    regions: [
      {
        domain: 'iron.fpmp.net',
        code: 'de',
        imageCode: 'de',
        high_diff_avail: false,
      },
    ],
    hardware: [
      {
        title: 'GPU Standard Mining',
        key: 'GPU',
        miners: [
          {
            os: ['windows', 'linux'],
            title: 'BzMiner',
            key: 'bzminer',
            description: '',
            fee: [1],
            compatibleGpus: ['AMD', 'NVIDIA'],
            downloadLink: 'https://github.com/bzminer/bzminer/releases',
            cmd: 'bzminer.exe -a ironfish -w WALLET_ADDRESS.WORKER_NAME -p stratum+tcp://iron.fpmp.net:8888 --nc 1',
          },
          {
            os: ['windows', 'linux'],
            title: 'Rigel Miner',
            key: 'rigelminer',
            description: '',
            fee: [0.7],
            compatibleGpus: ['NVIDIA'],
            downloadLink: 'https://github.com/rigelminer/rigel/releases',
            cmd: 'rigel.exe -a ironfish -o stratum+tcp://iron.fpmp.net:8888 -u WALLET_ADDRESS -w WORKER_NAME',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'TeamRedMiner',
            key: 'teamreadminer',
            description: '',
            fee: [0.75, 1],
            compatibleGpus: ['AMD'],
            downloadLink: 'https://github.com/todxx/teamredminer/releases',
            cmd: 'teamredminer.exe -a ironfish -o stratum+tcp://iron.fpmp.net:8888 -u WALLET_ADDRESS.WORKER_NAME -p x --fan_control',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'lolMiner',
            key: 'lolminer',
            description: '',
            fee: [0.75],
            compatibleGpus: ['AMD', 'NVIDIA'],
            downloadLink:
              'https://github.com/Lolliedieb/lolMiner-releases/releases',
            cmd: 'lolMiner.exe --algo IRONFISH -p stratum+tcp://iron.fpmp.net:8888 -u WALLET_ADDRESS.WORKER_NAME',
          },
        ],
      },
    ],
  },
];
