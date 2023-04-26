export const checksumIron = (input: string) => {
  const inputSplit = input.split('+');

  const addr = inputSplit[0];
  var memo = '';

  if (inputSplit.length >= 2) {
    const memoRegex = /^[a-zA-Z0-9]{1,32}$/;
    memo = inputSplit.slice(1, inputSplit.length).join('+');
    if (!memoRegex.test(memo)) {
      return null;
    }
  }

  const addrBytes = hexToBytes(addr);
  if (!addrBytes) {
    return null;
  }

  if (addrBytes.length != 32) {
    return null;
  }

  var out = bytesToHex(addrBytes);
  if (memo !== '') {
    out += '+' + memo;
  }

  return out;
};

function hexToBytes(hex) {
  let bytes = [] as number[];
  var inp = '';
  for (let c = 0; c < hex.length; c += 2) {
    inp = hex.substr(c, 2);

    // * This is extremely slow and inefficeint, but unfortunately we have to do it since JS doesn't support error handling in `parseInt`.
    if (!/[0-9a-fA-F]{2}/.test(inp)) {
      // Bad hex.
      return null;
    }

    bytes.push(parseInt(inp, 16));
  }

  return bytes;
}

function bytesToHex(bytes) {
  let hex = [] as string[];
  for (let i = 0; i < bytes.length; i++) {
    let current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
    hex.push((current >>> 4).toString(16));
    hex.push((current & 0xf).toString(16));
  }
  return hex.join('');
}
