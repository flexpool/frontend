import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import HandleLegacyLangVariable from './helpers/LanguageSelectionHelper';

export const SupportOldUrlSupportPage: React.FC<
  RouteComponentProps<{ lang: string }>
> = ({
  match: {
    params: { lang },
  },
}) => {
  HandleLegacyLangVariable(lang);
  return <Redirect to={`/support`} />;
};

export default SupportOldUrlSupportPage;
