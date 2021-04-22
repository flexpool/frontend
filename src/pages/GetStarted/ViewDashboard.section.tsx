import { useLocation } from 'react-router';
import qs from 'query-string';
import { Highlight } from 'src/components/Typo/Typo';
import { Spacer } from 'src/components/layout/Spacer';
import React from 'react';
import { Button } from 'src/components/Button';
import { LinkOut } from 'src/components/LinkOut';

export const ViewDashboardSection: React.FC<{ ticker?: string }> = ({
  ticker,
}) => {
  const { search } = useLocation();

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
        <Highlight>#5</Highlight> View your stats
      </h2>
      <p>
        Once you start mining, your data should appear on your dashboard. Please
        allow up to 10 minutes for the data to be processed.
      </p>
      <Spacer />
      <p>
        <Button
          variant="primary"
          as={LinkOut}
          href={`/miner/${ticker}/${walletAddress}`}
        >
          Open dashboard
        </Button>
      </p>
    </>
  );
};
