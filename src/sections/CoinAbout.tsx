import React from 'react';
import { useTranslation } from 'next-i18next';
import { FaGlobeAmericas, FaPaperclip } from 'react-icons/fa';
import { Card } from 'src/components/layout/Card';
import { LinkOut } from 'src/components/LinkOut';
import { ApiPoolCoinFull } from 'src/types/PoolCoin.types';
import styled from 'styled-components';

const Resource = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin-right: 0.5rem;
  }
  margin-top: 0.5rem;
  color: var(--text-secondary);
`;

export const CoinAbout: React.FC<{ data?: ApiPoolCoinFull }> = ({ data }) => {
  const { t } = useTranslation('home');
  if (!data) {
    return null;
  }

  return (
    <Card padding>
      <h2>{t(`coin_news_item.${data.ticker}.title`)}</h2>
      <p>{t(`coin_news_item.${data.ticker}.description`)}</p>
      <h4>{t(`coin_news_item.resources`)}</h4>
      <Resource>
        <FaGlobeAmericas />
        <LinkOut href={data.websiteLink}>{t(`coin_news_item.website`)}</LinkOut>
      </Resource>
      <Resource>
        <FaPaperclip />
        <LinkOut href={data.whitepaperLink}>
          {t(`coin_news_item.whitepaper`)}
        </LinkOut>
      </Resource>
    </Card>
  );
};
