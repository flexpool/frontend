import { bech32m } from './bech32';

export const checksumXCH = (input: string) => {
  try {
    bech32m.decode(input);
    return input;
  } catch {
    return null;
  }
};
