export const getCoinIconUrl = (
  ticker: string,
  size: 'medium' | 'large' | 'small' = 'small'
) => `https://static.flexpool.io/assets/coinLogos/${size}/${ticker}.png`;

export const getNetworkIconUrl = (
  network: string,
  size: 'medium' | 'large' | 'small' | 'thumb' = 'small'
) => `https://static.flexpool.io/assets/networks/${size}/${network}.png`;

export const getCoinIconSrc = (ticker: string) => `/icons/coins/${ticker}.svg`;

export const getOsLogoUrl = (os: 'linux' | 'windows' | 'hiveos') =>
  `https://static.flexpool.io/assets/os/${os}.png`;
