import { Helmet } from 'react-helmet-async';
import { useRouteMatch } from 'react-router';
import { BlocksSection } from './MinerBlocks.section';
import { MinerRewardsBlocksSection } from './MinerReportBlocks.section';
export const MinerBlocksPage = () => {
  const {
    params: { address },
  } = useRouteMatch<{ address: string }>();
  return (
    <>
      <Helmet>
        <title>Miner blocks</title>
      </Helmet>
      <MinerRewardsBlocksSection address={address}></MinerRewardsBlocksSection>
      <BlocksSection address={address} />
    </>
  );
};
