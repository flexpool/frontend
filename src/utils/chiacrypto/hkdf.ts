import hmacSHA512 from 'crypto-js/hmac-sha512';

// Code is primarily taken from https://github.com/futoin/util-js-hkdf

/**
 * Get expected hash length.
 *
 * @func
 * @alias hkdf.hash_length
 * @param {string} hash - Hash algorithm (as in underlying Node.js crypto library)
 * @returns {integer} hash digest byte length
 *
 * @note Values are hardcoded with fallback for unknown algorithms.
 */
const hash_length = (hash: string) => {
  switch (hash) {
    case 'sha256':
      return 32;
    case 'sha512':
      return 64;
    case 'sha224':
      return 28;
    case 'sha384':
      return 48;
    case 'sha3-256':
      return 32;
    case 'sha3-512':
      return 64;
    case 'sha3-224':
      return 28;
    case 'sha3-384':
      return 48;
    case 'blake2s256':
      return 32;
    case 'blake2b512':
      return 64;
    case 'sha1':
      return 20;
    case 'md5':
      return 16;
    default: {
      throw Error(`unknown hash function ${hash}`);
    }
  }
};

const hmac = async (key: Buffer, data: Buffer) => {
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw', // raw format of the key - should be Uint8Array
    key,
    {
      // algorithm details
      name: 'HMAC',
      hash: { name: 'SHA-256' },
    },
    false, // export = false
    ['sign', 'verify'] // what this key can do
  );

  const sig = await window.crypto.subtle.sign('HMAC', cryptoKey, data);
  return sig;
};

const hkdf_extract = async (hash_len: number, ikm: Buffer, salt: Buffer) => {
  const b_salt = salt && salt.length ? salt : Buffer.alloc(hash_len, 0);

  return await hmac(b_salt, ikm);
};

const hkdf_expand = async (prk: Buffer, length: number, info: Buffer) => {
  const hash_len = 32;
  const b_info = Buffer.isBuffer(info) ? info : Buffer.from(info || '');
  const info_len = b_info.length;

  const steps = Math.ceil(length / hash_len);

  if (steps > 0xff) {
    throw new Error(`OKM length ${length} is too long`);
  }

  // use single buffer with unnecessary create/copy/move operations
  const t = Buffer.alloc(hash_len * steps + info_len + 1);

  for (let c = 1, start = 0, end = 0; c <= steps; ++c) {
    // add info
    b_info.copy(t, end);
    // add counter
    t[end + info_len] = c;

    Buffer.from(await hmac(prk, t.slice(start, end + info_len + 1))).copy(t, end);

    start = end; // used for T(C-1) start
    end += hash_len; // used for T(C-1) end & overall end
  }

  return t.slice(0, length);
};

/**
 * HMAC-based Extract-and-Expand Key Derivation Function (HKDF)
 *
 * @param {Buffer|string} ikm - Initial Keying Material
 * @param {integer} length - Required byte length of output
 * @param {Buffer|string} salt='' - Optional salt (recommended)
 * @param {Buffer|string} info='' - Optional context (safe to skip)
 * @param {string} hash='SHA-256' - HMAC hash function to use
 * @returns {Buffer} Raw buffer with derived key of @p length bytes
 */
export async function hkdf(ikm: Buffer, length: number, salt: Buffer, info: Buffer) {
  // 1. extract
  const prk = await hkdf_extract(32, ikm, salt);

  // 2. expand
  return hkdf_expand(Buffer.from(prk), length, info);
}
