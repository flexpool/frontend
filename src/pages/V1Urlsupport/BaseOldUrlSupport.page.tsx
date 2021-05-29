import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import HandleLegacyLangVariable from './helpers/LanguageSelectionHelper';

export const MinerOldUrlSupportPage: React.FC<
  RouteComponentProps<{ langOrAddress: string }>
> = ({
  match: {
    params: { langOrAddress },
  },
}) => {
  if (langOrAddress && langOrAddress.length === 2) {
    HandleLegacyLangVariable(langOrAddress);
    return <Redirect to={`/`} />;
  } else {
    return <Redirect to={`/miner/eth/${langOrAddress}`} />;
  }
};

export default MinerOldUrlSupportPage;
