import { Helmet } from 'react-helmet-async';
import { useRouteMatch } from 'react-router';
import { BlocksSection } from './MinerBlocks.section';
export const MinerBlocksPage = () => {
  const {
    params: { address },
  } = useRouteMatch<{ address: string }>();
  return (
    <>
      <Helmet>
        <title>Miner blocks</title>
      </Helmet>
      <BlocksSection address={address} />
    </>
  );
};
