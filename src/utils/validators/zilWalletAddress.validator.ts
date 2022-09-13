import { bech32 } from './bech32';

export const isZilAddress = (address: string) => {
  try {
    const r = bech32.decode(address);
    if (r.prefix === 'zil') {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const checksumZIL = (input: string) => {
  try {
    bech32.decode(input);
    return input;
  } catch {
    return null;
  }
};
