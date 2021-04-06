type GpuHardwareDetails = {
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
};

type MineableCoin = {
  name: string;
  ticker: string;
  algorithm: string;
  regions: MineableCoinRegion[];
  hardware: {
    title: string;
    key: 'GPU';
    miners: GpuHardwareDetails[];
  }[];
};

export const mineableCoins: MineableCoin[] = [
  {
    name: 'Ethereum',
    ticker: 'eth',
    algorithm: 'Ethash',
    regions: [
      {
        domain: 'eth-us-east.flexpool.io',
        title: 'United States East',
        code: 'us-east',
      },
      {
        domain: 'eth-us-west.flexpool.io',
        title: 'United States West',
        code: 'us-west',
      },
      { domain: 'eth-de.flexpool.io', title: 'Germany', code: 'de' },
      { domain: 'eth-se.flexpool.io', title: 'Sweden', code: 'se' },
      { domain: 'eth-sg.flexpool.io', title: 'Singapore', code: 'sg' },
      { domain: 'eth-au.flexpool.io', title: 'Australia', code: 'au' },
      { domain: 'eth-br.flexpool.io', title: 'Brazil', code: 'br' },
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
            description: '',
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
        ],
      },
    ],
  },
];
