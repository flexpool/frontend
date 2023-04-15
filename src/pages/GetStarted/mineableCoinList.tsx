import { checksumIron } from '@/utils/validators/ironWalletAddress.validator';
import { checksumETH } from 'src/utils/validators/ethWalletAddress.validator';
import { checksumXCH } from 'src/utils/validators/xchWalletAddress.validator';
import { checksumZIL } from 'src/utils/validators/zilWalletAddress.validator';

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
  description: string;
  walletAddressExample: string;
  regex: RegExp;
  validator: (address: string) => null | string;
  hardware: MineableCoinHardware[];
  nicehashAvailable: boolean;
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
            description: 'Best miner for AMD GPUs',
            fee: [0.75, 1],
            compatibleGpus: ['AMD'],
            downloadLink: 'https://github.com/todxx/teamredminer/releases',
            cmd: 'teamredminer.exe -a etchash -o stratum+ssl://CLOSEST_SERVER:5555 -u WALLET_ADDRESS.WORKER_NAME -o stratum+ssl://BACKUP_SERVER:5555 -u WALLET_ADDRESS.WORKER_NAME -p x --eth_stratum ethproxy',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'T-Rex Miner',
            key: 'trexminer',
            description: 'Best miner for NVIDIA 20/30 Series GPUs',
            fee: [1],
            compatibleGpus: ['NVIDIA'],
            downloadLink: 'https://trex-miner.com/',
            cmd: 't-rex.exe -a etchash -o stratum+ssl://CLOSEST_SERVER:5555 -o stratum+ssl://BACKUP_SERVER:5555 -u WALLET_ADDRESS -p x -w WORKER_NAME',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'lolMiner',
            key: 'lolminer',
            description: 'Best miner for 4GB zombie mode.',
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
            description: 'Proprietary Ethash miner with low devfee.',
            fee: [0.65],
            compatibleGpus: ['AMD', 'NVIDIA'],
            downloadLink: 'https://phoenixminer.info/downloads/',
            cmd: 'PhoenixMiner.exe -pool ssl://CLOSEST_SERVER:5555 -pool2 ssl://BACKUP_SERVER:5555 -wal WALLET_ADDRESS.WORKER_NAME',
          },
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'GMiner',
            key: 'gminer',
            description: 'Actively developed and stable miner.',
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
    validator: checksumXCH,
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
    name: 'Zilliqa',
    ticker: 'zil',
    algorithm: 'Ethash',
    nicehash_algorithm: null,
    description: '',
    regex: /^zil1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{38}$/g,
    validator: checksumZIL,
    walletAddressExample: 'zil102n74869xnvdwq3yh8p0k9jjgtejruft268tg8',
    nicehashAvailable: false,
    regions: [
      {
        domain: 'zil.flexpool.io',
        code: 'zil',
        imageCode: 'worldwide',
      },
    ],
    hardware: [
      {
        title: 'GPU Dual Mining',
        key: 'dual',
        miners: [
          {
            os: ['windows', 'linux', 'hiveos'],
            title: 'GMiner',
            key: 'gminer',
            description: 'Actively developed and stable miner.',
            compatibleGpus: ['AMD', 'NVIDIA'],
            fee: [1],
            downloadLink:
              'https://github.com/develsoftware/GMinerRelease/releases',
            cmd: 'miner.exe -a etc --ssl 1 -s CLOSEST_SERVER:5555 -u MAIN_WALLET_ADDRESS.WORKER_NAME --ssl 1 -s BACKUP_SERVER:5555 -u MAIN_WALLET_ADDRESS.WORKER_NAME --zilserver zmp://zil.flexpool.io --ziluser DUAL_WALLET_ADDRESS',
          },
          {
            os: ['windows', 'linux'],
            title: 'BzMiner',
            key: 'bzminer',
            description:
              'Fast Windows/Linux miner with remote management and lowest 0.5% dev fee! (0% fee on ZIL)',
            fee: [0.5],
            compatibleGpus: ['AMD', 'NVIDIA'],
            downloadLink: 'https://github.com/bzminer/bzminer/releases',
            cmd: 'bzminer.exe -a ALGO -w MAIN_WALLET_ADDRESS.WORKER_NAME -p  ethstratum+ssl://CLOSEST_SERVER:5555 ethstratum+ssl://BACKUP_SERVER:5555 --a2 zil --w2 DUAL_WALLET_ADDRESS.WORKER_NAME --p2 zmp://zil.flexpool.io --log_date 1',
          },
          {
            os: ['windows', 'linux'],
            title: ' Rigel Miner',
            key: 'rigelminer',
            description: 'Miner optimized for NVIDIA GPUs.',
            fee: [0.7],
            compatibleGpus: ['NVIDIA'],
            downloadLink: 'https://github.com/rigelminer/rigel/releases',
            cmd: 'rigel.exe -a etchash+zil -o ethproxy+ssl://CLOSEST_SERVER:5555 -o ethproxy+ssl://BACKUP_SERVER:5555 -u [1]MAIN_WALLET_ADDRESS -o [2]zmp://zil.flexpool.io -u DUAL_WALLET_ADDRESS -w WORKER_NAME',
          },
        ],
      },
      {
        title: 'ASIC Dual Mining',
        key: 'dual-asic',
        miners: [],
      },
    ],
  },
  {
    name: 'Iron Fish (Testnet)',
    ticker: 'tiron',
    algorithm: 'Blake 3',
    nicehash_algorithm: null,
    description: '',
    regex: /^[A-Fa-f0-9]{64}$/,
    validator: checksumIron,
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
            description:
              'Fast Windows/Linux miner with remote management and lowest 0.5% dev fee! (0% fee on ZIL)',
            fee: [0.5],
            compatibleGpus: ['AMD', 'NVIDIA'],
            downloadLink: 'https://github.com/bzminer/bzminer/releases',
            cmd: 'bzminer.exe -a ironfish -w WALLET_ADDRESS -p stratum+tcp://CLOSEST_SERVER:8888 --nc 1',
          },
        ],
      },
      {
        title: 'GPU Dual Mining',
        key: 'dual',
        miners: [
          {
            os: ['windows', 'linux'],
            title: 'BzMiner',
            key: 'bzminer',
            description:
              'Fast Windows/Linux miner with remote management and lowest 0.5% dev fee! (0% fee on ZIL)',
            fee: [0.5],
            compatibleGpus: ['AMD', 'NVIDIA'],
            downloadLink: 'https://github.com/bzminer/bzminer/releases',
            cmd: 'bzminer -a ironfish -w MAIN_WALLET_ADDRESS -p stratum+tcp://iron.fpmp.net:8888 --nc 1 --a2 zil --w2 DUAL_WALLET_ADDRESS --p2 zmp://zil.flexpool.io',
          },
        ],
      },
    ],
  },
];
