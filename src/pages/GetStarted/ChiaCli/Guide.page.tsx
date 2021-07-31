// TODO: Remove this TS nocheck
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import qs from 'query-string';
import { useTranslation } from 'next-i18next';

import { Page } from 'src/components/layout/Page';
import { Spacer } from 'src/components/layout/Spacer';
import { Highlight } from 'src/components/Typo/Typo';
import { MineableCoinHardware, mineableCoins } from '../mineableCoinList';
import { Mono } from 'src/components/Typo/Typo';
import { PingTestSection } from '../ChiaShared/PingTest.section';
import { TerminalCommand } from './TerminalCommand';
import { JoinSection } from './Join.section';
import { CreatePlotsSection } from './CreatePlots.section';
import merge from 'lodash.merge';

export const ChiaCliGuidePage: React.FC = () => {
  const router = useRouter();
  const ticker = router.query.ticker;
  const { t } = useTranslation('get-started');

  const mineableCoin = React.useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
  }, [ticker]);

  const jsonHw = t(`detail_${ticker}.hardware`, {
    returnObjects: true,
  }) as MineableCoinHardware[];

  const mineableCoinConfig = React.useMemo(() => {
    const mergedHw = merge(mineableCoin?.hardware, jsonHw);
    return mergedHw.find((item) => item.key === 'XCH-CLI');
  }, [jsonHw, mineableCoin?.hardware]);

  let primaryServer = 'POOL_URL';
  let farmerOption = 'new-farmer';
  const [urlState, setUrlState] = useState(new Date());
  let search;

  if (typeof window !== 'undefined') {
    search = window.location.search;
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', function (event) {
        setUrlState(new Date());
      });
    }
    const query = qs.stringify({
      ...qs.parse(search),
      farmerOption: 'new-farmer',
    });

    const newUrl = `${router.asPath.split('?')[0]}/?${query}`;
    window.history.pushState(
      { ...window.history.state, as: newUrl, url: newUrl },
      '',
      newUrl
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchParams = React.useMemo(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    primaryServer = qs.parse(search).primaryServer
      ? qs.parse(search).primaryServer
      : 'POOL_URL';
    // eslint-disable-next-line react-hooks/exhaustive-deps
    farmerOption = qs.parse(search).farmerOption
      ? qs.parse(search).farmerOption
      : 'new-farmer';
  }, [urlState]);

  const setSelectedFarmerOption = (s: string) => {
    if (typeof window !== 'undefined') {
      search = window.location.search;
    }
    const query = qs.stringify({
      ...qs.parse(search),
      farmerOption: s,
    });

    const newUrl = `${router.asPath.split('?')[0]}/?${query}`;

    window.history.pushState(
      { ...window.history.state, as: newUrl, url: newUrl },
      '',
      newUrl
    );
    let queryStringChange = new Event('popstate');
    window.dispatchEvent(queryStringChange);
  };

  if (!mineableCoin || !mineableCoinConfig) {
    return router.push('/get-started');
  }

  return (
    <Page>
      <h1>{t('detail_xch.title_cli')}</h1>
      <PingTestSection data={mineableCoin.regions} />
      <Spacer size="xl" />
      <JoinSection
        primaryServer={primaryServer as string}
        selectedFarmerOption={farmerOption as string}
        setSelectedFarmerOption={setSelectedFarmerOption}
      />
      <Spacer size="xl" />
      <h2>
        <Highlight>#3</Highlight> {t('detail_xch.plotnft_show.title')}
      </h2>
      <p>{t('detail_xch.plotnft_show.desc')}</p>
      <Spacer />
      <p>{t('detail_xch.plotnft_show.show_command')}</p>
      <TerminalCommand
        cmd={`chia plotnft show`}
        output={
          <>
            {`Choose wallet key:
          1) 3118587270
          2) 2183884896
          3) 1324486352
          Enter a number to pick or q to quit: `}{' '}
            <b>1</b>
            {`

          Wallet height: ...
          Sync status: Synced

          Wallet id 2:
          Current state: FARMING_TO_POOL
          Current state from block height: ...
          Launcher ID: 4973f2b459881b08295dff931c26dc0e511ce6fd46948e142ee151b1f97d7f23
          Target address (not for plotting): xch1d00purr0n5ae8hz706rcwge90m09w00wa4v78d9fpawgdhs6p0fsjt6rd8
          Owner public key: 1b434567c4a027e0e737245f3168e6fff86972a40803fd9243e912db192785d8f06f789f18c226c2e2f6331604c79967
          P2 singleton address (pool contract address for plotting): xch1f9el9dze3qdss22al7f3cfkupeg3eehag62gu9pwu9gmr7ta0u3s225yls
          Current pool URL: ${primaryServer}
          Current difficulty: 1
          Points balance: 9999
          Relative lock height: 100 blocks
          Payout instructions (pool will pay to this address): xch1egymuhquwg94e8wdkn2gzulghs7sngnmdr4k003j8xqu76dgwhjs9n84mu`}
          </>
        }
      />

      <h4>{t('detail_xch.plotnft_show.grab_addresses')}</h4>
      <Spacer />
      <p>
        <ul>
          <li>
            <Mono>P2 Singleton Address</Mono> -{' '}
            {t('detail_xch.plotnft_show.plotting_address')}
          </li>
          <li>
            <Mono>Payout instructions</Mono> -{' '}
            {t('detail_xch.plotnft_show.payout_address')}
          </li>
        </ul>
      </p>
      <Spacer size="xl" />
      {farmerOption === 'new-farmer' ? (
        <>
          <CreatePlotsSection />
          <Spacer size="xl" />
        </>
      ) : null}
      <h2>
        <Highlight>#{farmerOption === 'new-farmer' ? 5 : 4}</Highlight>{' '}
        {t('detail_xch.monitor_farm.title')}
      </h2>
      <p>{t('detail_xch.monitor_farm.desc')}</p>
      <Spacer size="xl" />
    </Page>
  );
};
