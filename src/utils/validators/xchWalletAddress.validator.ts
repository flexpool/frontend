import { bech32m } from './bech32';

export const checksumXCH = (input: string) => {
  try {
    bech32m.decode(input);
    return input;
  } catch {
    return null;
  }
};

export const validateXCHAddress = (address: string) =>
  /^xch[a-zA-Z0-9]{59}$/g.test(address);
