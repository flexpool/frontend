import { checksumETH } from './ethWalletAddress.validator';
import { checksumIron } from './ironWalletAddress.validator';
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
    case 'tiron':
      return checksumIron;
    case 'iron':
      return checksumIron;
    default:
      return (hash: string) => {
        console.log(`Checksum for ${hash} not found`);
        return hash;
      };
  }
};
