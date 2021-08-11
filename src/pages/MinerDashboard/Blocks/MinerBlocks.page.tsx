import { BlocksSection } from './MinerBlocks.section';
export const MinerBlocksPage: React.FC<{
  address: string;
}> = ({ address }) => {
  return (
    <>
      <BlocksSection address={address} />
    </>
  );
};
