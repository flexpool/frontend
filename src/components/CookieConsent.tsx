import React from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/Button';
import { useLocalStorageState } from 'src/hooks/useLocalStorageState';
import { useTranslation } from 'react-i18next';

declare global {
  interface Window {
    Intercom: any;
  }
}

type CookieConsentProps = {
  consented?: String;
};
const CookieConsentBaseContainer = styled.div<CookieConsentProps>`
  ${(p) => `{
    ${p.consented === 'consented' && `display: none;`}
  }`}
  align-items: baseline;
  color: rgb(17, 20, 50);
  flex-wrap: wrap;
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

const CookieConsentContents = styled.div`
  width: 100%;
  max-width: 1200px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const CookieConsentText = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  margin-right: 2rem;
`;

const CookieConsent: React.FC<{}> = () => {
  const [cookieConsent, setCookieConsent] = useLocalStorageState<
    'consented' | 'false'
  >('cookie_consent', 'false');

  const { t } = useTranslation('home');

  React.useEffect(() => {
    window.Intercom('update', {
      hide_default_launcher: true,
    });
  }, []);

  const applyConsent = () => {
    window.Intercom('update', {
      hide_default_launcher: false,
    });
    setCookieConsent('consented');
  };
  return (
    <CookieConsentBaseContainer consented={cookieConsent}>
      <CookieConsentContents>
        <CookieConsentText>
          {t('home:cookie_consent.cookie_consent_text')}
        </CookieConsentText>
        <Button variant="primary" size="sm" shadowless onClick={applyConsent}>
          {t('home:cookie_consent.i_agree')}
        </Button>
      </CookieConsentContents>
    </CookieConsentBaseContainer>
  );
};

export default CookieConsent;
