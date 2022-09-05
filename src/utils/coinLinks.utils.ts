const blockUrlMap = {
  eth: 'https://etherscan.io/block/%v',
  etc: 'https://blockscout.com/etc/mainnet/block/%v',
  xch: 'https://xchscan.com/blocks/%v',
  btc: 'https://www.blockchain.com/btc/block/%v',
  zil: 'https://devex.zilliqa.com/dsbk/%v',
};

const uncleUrlMap = {
  eth: 'https://etherscan.io/uncle/%v',
  etc: 'https://blockscout.com/etc/mainnet/block/%v',
};

const transactionUrlMap = {
  eth: 'https://etherscan.io/tx/%v',
  etc: 'https://blockscout.com/etc/mainnet/tx/%v',
  polygon: 'https://polygonscan.com/tx/%v',
  xch: 'https://xchscan.com/txns/%v',
  btc: 'https://www.blockchain.com/btc/tx/%v',
  zil: 'https://viewblock.io/zilliqa/tx/%v',
};

const walletAddressUrlMap = {
  eth: 'https://etherscan.io/address/%v',
  etc: 'https://blockscout.com/etc/mainnet/address/%v',
  polygon: 'https://polygonscan.com/address/%v',
  xch: 'https://xchscan.com/address/%v',
  btc: 'https://www.blockchain.com/btc/address/%v',
  zil: 'https://viewblock.io/zilliqa/address/%v',
};

const urlMaps = {
  wallet: walletAddressUrlMap,
  transaction: transactionUrlMap,
  block: blockUrlMap,
  uncle: uncleUrlMap,
};

export type CoinLinkType = keyof typeof urlMaps;
export const getCoinLink = (
  type: CoinLinkType,
  value: string,
  coin?: string
) => {
  const urlMap = urlMaps[type];

  if (typeof coin === 'string' && coin in urlMap) {
    const key = coin as keyof typeof urlMap;
    const url = urlMap[key];
    try {
      return url.replaceAll('%v', value);
    } catch {
      return undefined;
    }
  }

  return undefined;
};
