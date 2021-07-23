import { Helmet } from 'react-helmet-async';
import { BlocksSection } from './MinerBlocks.section';
export const MinerBlocksPage: React.FC<{
  address: string;
}> = ({ address }) => {
  return (
    <>
      {/* <Helmet>
        <title>Miner blocks</title>
      </Helmet> */}
      <BlocksSection address={address} />
    </>
  );
};
