export const isBTCAddress = (address: string | null) => {
  if (address == null) {
    return false
  }

  return address.toLowerCase().startsWith("btc:")
}

export const extractAddressFromBTCAddress = (address: string) => {
  if (!isBTCAddress(address)) {
    return address
  }
  return address.slice(4)
}