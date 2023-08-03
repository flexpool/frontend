import React from 'react';
import { getCoinIconUrl, getNetworkIconUrl } from 'src/utils/staticImage.utils';
import Image from 'next/image';

type CoinSize = 'lg' | 'xl';

const NetworkLogo: React.FC<{
  ticker: string;
  network: string;
  size?: CoinSize;
}> = ({ ticker, network, size }) => {
  const src = React.useMemo(() => {
    if (network === 'mainnet') {
      return getCoinIconUrl(ticker);
    }

    if (network == 'coin/btc') {
      return getCoinIconUrl('btc');
    }

    return getNetworkIconUrl(network);
  }, [ticker, network]);

  return (
    <Image
      width={20}
      height={20}
      src={src}
      alt={`${network} logo for ${ticker}`}
    />
  );
};

export default NetworkLogo;
