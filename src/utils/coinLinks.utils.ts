const blockUrlMap = {
  eth: 'https://etherscan.io/block/%v',
};

const uncleUrlMap = {
  eth: 'https://etherscan.io/uncle/%v',
};

const transactionUrlMap = {
  eth: 'https://etherscan.io/tx/%v',
};
const walletAddressUrlMap = {
  eth: 'https://etherscan.io/address/%v',
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
  hash: string,
  coin?: string
) => {
  const urlMap = urlMaps[type];

  if (typeof coin === 'string' && coin in urlMap) {
    const key = coin as keyof typeof urlMap;
    const url = urlMap[key];
    try {
      return url.replaceAll('%v', hash);
    } catch {
      return undefined;
    }
  }

  return undefined;
};
