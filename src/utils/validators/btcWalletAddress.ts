import validate, { Network } from "bitcoin-address-validation"

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

export const btcAddressValidator = (nativeValidator?: (input: string) => string | null) => {

  return (address: string) => {
    if (!isBTCAddress(address)) {
      return nativeValidator!!(address)
    }

    const extractedAddress = extractAddressFromBTCAddress(address)
    const valid = validate(extractedAddress, Network.mainnet)

    return valid ? "btc:" + extractedAddress : null
  }
}