import React from 'react';
import { Card } from 'src/components/layout/Card';
import { ApiPoolCoinFull } from 'src/types/PoolCoin.types';
import { Ticker } from 'src/types/Ticker.types';

const aboutCointsText = {
  eth:
    'Ethereum is a worldwide computer created to power Decentralized Applications known as Smart Contracts.',
};

type F = keyof typeof aboutCointsText;

const getAboutText = (ticker: Ticker) => {
  if (ticker in aboutCointsText) {
    const key = ticker as keyof typeof aboutCointsText;
    return aboutCointsText[key];
  }

  return null;
};

export const CoinAbout: React.FC<{ data: ApiPoolCoinFull }> = ({ data }) => {
  const about = getAboutText(data.ticker);
  return (
    <Card>
      <h3>About {data.name}</h3>
      {about && <p>{about}</p>}
    </Card>
  );
};
