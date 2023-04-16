import { BlocksSection } from './MinerBlocks.section';

export const MinerBlocksPage: React.FC<{
  address: string;
  coin: string;
}> = ({ address, coin }) => {
  return (
    <>
      <BlocksSection address={address} coin={coin} />
    </>
  );
};
