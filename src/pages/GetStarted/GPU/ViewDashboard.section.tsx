import { useLocation } from 'react-router';
import qs from 'query-string';
import { Highlight } from 'src/components/Typo/Typo';
import { Spacer } from 'src/components/layout/Spacer';
import React from 'react';
import { Button } from 'src/components/Button';
import { LinkOut } from 'src/components/LinkOut';
import { useTranslation } from 'next-i18next';

export const ViewDashboardSection: React.FC<{ ticker?: string }> = ({
  ticker,
}) => {
  const { search } = useLocation();
  const { t } = useTranslation('get-started');

  const walletAddress = React.useMemo(() => {
    const parsedSearch = qs.parse(search);
    return parsedSearch.walletAddress || '';
  }, [search]);

  if (!walletAddress || !ticker) {
    return null;
  }
  return (
    <>
      <h2>
        <Highlight>#5</Highlight> {t('detail.view.title')}
      </h2>
      <p>{t('detail.view.description')}</p>
      <Spacer />
      <p>
        <Button
          variant="primary"
          as={LinkOut}
          href={`/miner/${ticker}/${walletAddress}`}
        >
          {t('detail.view.cta')}
        </Button>
      </p>
    </>
  );
};
