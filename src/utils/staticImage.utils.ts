const publicUrl = process.env.PUBLIC_URL;

export const getCoinIconUrl = (ticker: string) =>
  `${publicUrl}/icons/coins/${ticker}.svg`;

export const getOsLogoUrl = (os: 'linux' | 'windows' | 'hiveos') =>
  `https://static.flexpool.io/assets/os/${os}.png`;
