import { checksumETH } from './ethWalletAddress.validator';
import { checksumXCH } from './xchWalletAddress.validator';

export const getChecksumByTicker = (ticker?: string) => {
  switch (ticker) {
    case 'eth':
      return checksumETH;
    case 'xch':
      return checksumXCH;
    default:
      return (hash: string) => {
        console.log(`Checksum for ${hash} not found`);
        return hash;
      };
  }
};
