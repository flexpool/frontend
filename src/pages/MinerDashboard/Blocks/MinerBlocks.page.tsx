import { useRouteMatch } from 'react-router';
import { BlocksSection } from 'src/sections/Blocks.section';

export const MinerBlocksPage = () => {
  const {
    params: { address },
  } = useRouteMatch<{ address: string }>();
  return (
    <>
      <BlocksSection address={address} />
    </>
  );
};
