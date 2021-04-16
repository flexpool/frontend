import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';

export const MinerOldUrlSupportPage: React.FC<
  RouteComponentProps<{ address: string }>
> = ({
  match: {
    params: { address },
  },
}) => {
  return <Redirect to={`/miner/eth/${address}`} />;
};

export default MinerOldUrlSupportPage;
