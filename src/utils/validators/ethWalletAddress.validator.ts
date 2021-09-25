import { keccak256 } from './keccak';

/**
 * Hashes values to a sha3 hash using keccak 256
 *
 * To hash a HEX string the hex must have 0x in front.
 *
 * @method sha3
 * @return {String} the sha3 string
 */
var SHA3_NULL_S =
  '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';

const sha3 = (value: string) => {
  const returnValue = keccak256(value);

  if (returnValue === SHA3_NULL_S) {
    return null;
  } else {
    return returnValue;
  }
};

/**
 * returns checksum if ok
 * @param input
 * @returns string | null
 */
export const checksumETH = (input: string) => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(input)) {
    return null;
  }
  const address = input.toLowerCase().replace(/^0x/i, '');
  const addrHash = sha3(address);

  if (addrHash === null) {
    return null;
  }
  const addressHash = addrHash.replace(/^0x/i, '');
  let checksumAddress = '0x';

  for (var i = 0; i < address.length; i++) {
    // If ith character is 8 to f then make it uppercase
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += address[i].toUpperCase();
    } else {
      checksumAddress += address[i];
    }
  }
  return checksumAddress;
};

export const validateETHAddress = (address: string) =>
  /^0x[a-fA-F0-9]{40}$/g.test(address);
