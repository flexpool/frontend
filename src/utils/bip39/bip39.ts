import { wordlist } from './wordlist';
import { pbkdf2 } from 'crypto';

// Code is primarily taken from https://github.com/bitcoinjs/bip39

const INVALID_MNEMONIC = 'Invalid mnemonic';
const INVALID_ENTROPY = 'Invalid entropy';
const INVALID_CHECKSUM = 'Invalid mnemonic checksum';

function normalize(str: string) {
  return (str || '').normalize('NFKD');
}

function lpad(str: string, padString: string, length: number) {
  while (str.length < length) {
    str = padString + str;
  }
  return str;
}

function binaryToByte(bin: string) {
  return parseInt(bin, 2);
}

function bytesToBinary(bytes: Array<number>) {
  return bytes.map((x) => lpad(x.toString(2), '0', 8)).join('');
}

async function deriveChecksumBits(entropyBuffer: Buffer) {
  const ENT = entropyBuffer.length * 8;
  const CS = ENT / 32;
  const hash = await crypto.subtle.digest('SHA-256', entropyBuffer);
  return bytesToBinary(Array.from(Buffer.from(hash))).slice(0, CS);
}

export async function mnemonicToEntropy(mnemonic: string) {
  const words = normalize(mnemonic).split(' ');
  if (words.length % 3 !== 0) {
    throw new Error(INVALID_MNEMONIC);
  }
  // convert word indices to 11 bit binary strings
  const bits = words
    .map((word) => {
      const index = wordlist.indexOf(word);
      if (index === -1) {
        throw new Error(INVALID_MNEMONIC);
      }
      return lpad(index.toString(2), '0', 11);
    })
    .join('');
  // split the binary string into ENT/CS
  const dividerIndex = Math.floor(bits.length / 33) * 32;
  const entropyBits = bits.slice(0, dividerIndex);
  const checksumBits = bits.slice(dividerIndex);
  // calculate the checksum and compare
  const entropyBytes = entropyBits.match(/(.{1,8})/g)?.map(binaryToByte);
  if (entropyBytes === undefined) {
    throw new Error(INVALID_MNEMONIC);
  }

  if (entropyBytes.length < 16) {
    throw new Error(INVALID_ENTROPY);
  }
  if (entropyBytes.length > 32) {
    throw new Error(INVALID_ENTROPY);
  }
  if (entropyBytes.length % 4 !== 0) {
    throw new Error(INVALID_ENTROPY);
  }
  const entropy = Buffer.from(entropyBytes);
  const newChecksum = await deriveChecksumBits(entropy);
  if (newChecksum !== checksumBits) {
    throw new Error(INVALID_CHECKSUM);
  }
  return entropy.toString('hex');
}

export async function validateMnemonic(mnemonic: string) {
  try {
    await mnemonicToEntropy(mnemonic);
  } catch (e) {
    return false;
  }
  return true;
}

function salt(password: string) {
  return 'mnemonic' + (password || '');
}

function pbkdf2Promise(
  password: Buffer,
  saltMixin: Buffer,
  iterations: number,
  keylen: number,
  digest: string
) {
  return Promise.resolve().then(
    () =>
      new Promise((resolve, reject) => {
        const callback = (err: Error | null, derivedKey: Buffer) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(derivedKey);
          }
        };
        pbkdf2(password, saltMixin, iterations, keylen, digest, callback);
      })
  );
}

export function mnemonicToSeed(mnemonic: string) {
  return Promise.resolve().then(() => {
    const mnemonicBuffer = Buffer.from(normalize(mnemonic), 'utf8');
    // Passwords aren't really used with Chia
    const password = '';
    const saltBuffer = Buffer.from(salt(normalize(password)), 'utf8');
    return pbkdf2Promise(mnemonicBuffer, saltBuffer, 2048, 64, 'sha512');
  });
}
