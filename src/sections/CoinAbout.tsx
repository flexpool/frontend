import React from 'react';
import { FaGlobeAmericas, FaPaperclip } from 'react-icons/fa';
import { Card } from 'src/components/layout/Card';
import { LinkOut } from 'src/components/LinkOut';
import { ApiPoolCoinFull } from 'src/types/PoolCoin.types';
import { Ticker } from 'src/types/Ticker.types';
import styled from 'styled-components';

const aboutCointsText = {
  eth:
    'Ethereum is a worldwide computer created to power Decentralized Applications known as Smart Contracts.',
};

const Resource = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin-right: 0.5rem;
  }
  margin-top: 0.5rem;
  color: var(--text-secondary);
`;

const getAboutText = (ticker: Ticker) => {
  if (ticker in aboutCointsText) {
    const key = ticker as keyof typeof aboutCointsText;
    return aboutCointsText[key];
  }

  return null;
};

export const CoinAbout: React.FC<{ data?: ApiPoolCoinFull }> = ({ data }) => {
  if (!data) {
    return null;
  }

  const about = getAboutText(data.ticker);
  return (
    <Card padding>
      <h2>About {data.name}</h2>
      {about && <p>{about}</p>}
      <h4>Resources</h4>
      <Resource>
        <FaGlobeAmericas />
        <LinkOut href={data.websiteLink}>Website</LinkOut>
      </Resource>
      <Resource>
        <FaPaperclip />
        <LinkOut href={data.whitepaperLink}>Whitepaper</LinkOut>
      </Resource>
    </Card>
  );
};
