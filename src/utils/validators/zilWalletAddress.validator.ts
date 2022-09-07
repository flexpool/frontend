import { bech32 } from './bech32';

export const isBech32 = (raw: string) => {
  return !!raw.match(/^zil1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{38}$/);
};

export const checksumZIL = (input: string) => {
  try {
    bech32.decode(input);
    return input;
  } catch {
    return null;
  }
};
