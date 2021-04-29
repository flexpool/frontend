import { checksumEth } from './ethWalletAddress.validator';

export const getChecksumByTicker = (ticker?: string) => {
  switch (ticker) {
    case 'eth':
      return checksumEth;
    default:
      return (hash: string) => {
        console.log(`Checksum for ${hash} not found`);
        return hash;
      };
  }
};
