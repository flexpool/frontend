import React from 'react';
import HandleLegacyLangVariable from '../src/helpers/LanguageSelectionHelper';
import router from 'next/router';

function langOrAddress() {
  console.log(router);
  if (langOrAddress && langOrAddress.length <= 5) {
    HandleLegacyLangVariable(langOrAddress);
    return router.push('/');
  } else {
    return router.push(`/miner/eth/${langOrAddress}`);
  }
}

export default langOrAddress;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
