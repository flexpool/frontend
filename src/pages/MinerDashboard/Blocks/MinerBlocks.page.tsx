import { BlocksSection } from './MinerBlocks.section';
export const MinerBlocksPage: React.FC<{
  address: string;
}> = ({ address }) => {
  return (
    <>
      {/* <Head>
        <title>Miner blocks</title>
      </Head> */}
      <BlocksSection address={address} />
    </>
  );
};
