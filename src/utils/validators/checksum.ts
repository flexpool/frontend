import { checksumETH } from './ethWalletAddress.validator';
import { checksumXCH } from './xchWalletAddress.validator';
import { checksumZIL } from './zilWalletAddress.validator';

export const getChecksumByTicker = (ticker?: string) => {
  switch (ticker) {
    case 'eth':
      return checksumETH;
    case 'xch':
      return checksumXCH;
    case 'zil':
      return checksumZIL;
    default:
      return (hash: string) => {
        console.log(`Checksum for ${hash} not found`);
        return hash;
      };
  }
};
