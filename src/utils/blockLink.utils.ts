const blockUrlMap = {
  eth: 'https://etherscan.io/block/%v',
};
export const getBlockLink = (blockHash: string, coin?: string) => {
  if (typeof coin === 'string' && coin in blockUrlMap) {
    const key = coin as keyof typeof blockUrlMap;
    const url = blockUrlMap[key];
    return url.replaceAll('%v', blockHash);
  }

  return null;
};

const transactionUrlMap = {
  eth: 'https://etherscan.io/tx/%v',
};
export const getTransactionLink = (transactionHash: string, coin?: string) => {
  if (typeof coin === 'string' && coin in transactionUrlMap) {
    const key = coin as keyof typeof transactionUrlMap;
    const url = transactionUrlMap[key];
    return url.replaceAll('%v', transactionHash);
  }

  return null;
};

export type CoinLinkType = 'block' | 'transaction';

const mappedFunctions: {
  [key in CoinLinkType]: (value: string, coin?: string) => string | null;
} = {
  block: getBlockLink,
  transaction: getTransactionLink,
};

export const getCoinLink = (
  type: CoinLinkType,
  hash: string,
  coin?: string
) => {
  const foo = mappedFunctions[type];
  return foo(hash, coin);
};
