import { LinkOut } from '@/components/LinkOut';
import { Button } from '@/components/Button';

export const DashboardLink = ({
  coin,
  address,
}: {
  coin: { ticker: string; name: string };
  address: string;
}) => {
  return (
    <Button
      variant="primary"
      as={LinkOut}
      href={`/miner/${coin.ticker}/${address}`}
    >
      Open {coin.name} Dashboard
    </Button>
  );
};

export default DashboardLink;
