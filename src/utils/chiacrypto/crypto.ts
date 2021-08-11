import { hkdf } from './hkdf';

const BLS12381_Q = BigInt(
  '52435875175126190479447740508185965837690552500527637822603658699938581184513'
);

function extractAndExpand(length: number, key: Buffer, salt: Buffer, info: Buffer) {
  return hkdf(key, length, salt, info);
}

function ikmToLamportSecretKey(ikm: Buffer, salt: Buffer) {
  return extractAndExpand(32 * 255, ikm, salt, Buffer.from(''));
}

async function deriveLamportPublicKey(ikm: Buffer, index: number) {
  const ikmPadded = Buffer.concat([Buffer.from(new ArrayBuffer(32 - ikm.length)), ikm]);
  const salt = new ArrayBuffer(4);
  const saltView = new DataView(salt);
  saltView.setUint32(0, index, false);
  var ikmInv = new Uint8Array(ikmPadded.length);
  for (var i = 0; i < 32; i++) {
    ikmInv[i] = ikmPadded[i] ^ 0xff;
  }

  const lamport0 = await ikmToLamportSecretKey(ikmPadded, Buffer.from(salt));
  const lamport1 = await ikmToLamportSecretKey(Buffer.from(ikmInv), Buffer.from(salt));

  var lamportPrivateKey = new Uint8Array(16320);
  for (var i = 0; i < 255; i++) {
    const hash = await crypto.subtle.digest(
      'SHA-256',
      lamport0.subarray(i * 32, (i + 1) * 32)
    );
    for (var j = 0; j < 32; j++) {
      lamportPrivateKey[i * 32 + j] = hash[j];
    }
  }

  for (var i = 0; i < 255; i++) {
    const hash = await crypto.subtle.digest(
      'SHA-256',
      lamport1.subarray(i * 32, (i + 1) * 32)
    );
    for (var j = 0; j < 32; j++) {
      lamportPrivateKey[32 * 255 + i * 32 + j] = hash[j];
    }
  }

  const hash = await crypto.subtle.digest('SHA-256', lamportPrivateKey);
  return hash;
}

export async function keyGen(key: Buffer) {
  const okm = await extractAndExpand(
    48,
    Buffer.concat([key, Buffer.from([0])]),
    Buffer.from('BLS-SIG-KEYGEN-SALT-'),
    Buffer.from([0, 48])
  );

  console.log('okm', okm.toString('hex'));

  // TODO: Definitely not the fastest approach below
  const okmInt = BigInt('0x' + okm.toString('hex'));
  return Buffer.from((okmInt % BLS12381_Q).toString(16), 'hex');
}

async function deriveChildKey(parent: Buffer, index: number) {
  const lamportPublicKey = await deriveLamportPublicKey(parent, index);
  return keyGen(Buffer.from(lamportPublicKey));
}

export async function derivePath(parent: Buffer, path: Array<number>) {
  var key = parent;
  for (var i = 0; i < path.length; i++) {
    key = await deriveChildKey(key, path[i]);
  }
  return key;
}
