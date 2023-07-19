import validate, { Network } from 'bitcoin-address-validation';
import { checksumETH } from './ethWalletAddress.validator';
import { checksumIron } from './ironWalletAddress.validator';
import { checksumXCH } from './xchWalletAddress.validator';
import { checksumZIL } from './zilWalletAddress.validator';

export const getChecksumByTicker = (ticker: string) => {
  let checksumFunc: (name: string) => string | null

  switch (ticker) {
    case 'eth':
      checksumFunc = checksumETH;
      break;
    case 'xch':
      checksumFunc = checksumXCH;
      break;
    case 'zil':
      checksumFunc = checksumZIL;
      break;
    case 'tiron':
      checksumFunc = checksumIron;
      break;
    case 'iron':
      checksumFunc = checksumIron;
      break;
    default:
      return (hash: string) => {
        console.log(`Checksum for ${hash} not found (ticker ${ticker})`);
        return hash;
      };
  }

  // Now wrap the checksum function with the bitcoin checksum wrapper.
  return (addr: string) => {
    // This obviously needs to be proper.
    if (addr.toLowerCase().startsWith("btc:")) {
      // Slicing the address by 4 removes the "btc:" prefix.
      return validate(addr.slice(4), Network.mainnet) ? addr : null;
    }

    return checksumFunc(addr);
  }
};
