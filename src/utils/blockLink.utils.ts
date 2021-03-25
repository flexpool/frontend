const urlMap = {
  eth: 'https://etherscan.io/block/%v',
};
export function getBlockLink(blockHash: string, coin: string) {
  if (coin in urlMap) {
    const key = coin as keyof typeof urlMap;
    const url = urlMap[key];
    return url.replaceAll('%v', blockHash);
  }

  return null;
}
