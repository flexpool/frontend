import React from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/Button';
import { useLocalStorageState } from 'src/hooks/useLocalStorageState';
import { Trans, useTranslation } from 'next-i18next';
import { LinkOut } from './LinkOut';

declare global {
  interface Window {
    Intercom: any;
  }
}

type TermsConsentProps = {
  consented?: String;
};
const TermsConsentBaseContainer = styled.div<TermsConsentProps>`
  ${(p) => `{
    ${p.consented === 'consented' && `display: none;`}
  }`}
  align-items: baseline;
  color: rgb(17, 20, 50);
  left: 0px;
  position: fixed;
  width: 100%;
  z-index: 999;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  width: 100%;
`;

const TermsConsentContents = styled.div`
  width: 100%;
  max-width: 1200px;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 15px;
  padding-right: 15px;
`;

const TermsConsentText = styled.div`
  display: inline;
  font-size: 1.1rem;
  font-weight: 600;
  margin-right: 2rem;
  @media screen and (max-width: 768px) {
    display: block;
    text-align: center;
  }
`;

const AcceptConsentButton = styled(Button)`
  @media screen and (max-width: 768px) {
    margin-left: calc(50% - 37px);
    margin-top: 15px;
  }
`;

const TermsConsent: React.FC<{}> = () => {
  const [termsConsent, setTermsConsent] = useLocalStorageState<
    'termsConsented' | 'false'
  >('termsConsent', 'false');

  const { t, ready } = useTranslation('cookie-consent');

  const applyConsent = () => {
    setTermsConsent('termsConsented');
  };

  if (termsConsent === 'termsConsented') {
    return <></>;
  }

  return (
    <TermsConsentBaseContainer consented={termsConsent}>
      <TermsConsentContents>
        <TermsConsentText>
          {ready && (
            <Trans
              i18nKey="cookie_consent_text"
              components={{
                terms: (
                  <LinkOut href="https://static.flexpool.io/legal/terms.pdf" />
                ),
                privacypolicy: (
                  <LinkOut href="https://static.flexpool.io/legal/privacy-policy.pdf" />
                ),
              }}
              ns="cookie-consent"
            />
          )}
        </TermsConsentText>
        <AcceptConsentButton
          variant="primary"
          size="sm"
          shadowless
          onClick={applyConsent}
        >
          {t('i_agree')}
        </AcceptConsentButton>
      </TermsConsentContents>
    </TermsConsentBaseContainer>
  );
};

export default TermsConsent;
