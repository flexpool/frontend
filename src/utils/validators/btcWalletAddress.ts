export const isBTCAddress = (address: string | null) => {
  if (address == null) {
    return false
  }

  return address.toLowerCase().startsWith("btc:")
}

export const extractAddressFromBTCAddress = (address: string | null): string => {
  if (!isBTCAddress(address)) {
    return address || ""
  }
  // IsBTCAddr will reject if null.
  return address!!.slice(4)
}