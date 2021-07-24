import React from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/Button';
import { useLocalStorageState } from 'src/hooks/useLocalStorageState';
import { useTranslation } from 'next-i18next';

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
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 15px;
  padding-right: 15px;
`;

const CookieConsentText = styled.div`
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

const CookieConsent: React.FC<{}> = () => {
  const [cookieConsent, setCookieConsent] = useLocalStorageState<
    'consented' | 'false'
  >('cookie_consent', 'false');

  const { t } = useTranslation('cookie-consent');

  React.useEffect(() => {
    console.log(cookieConsent);
    window &&
      cookieConsent === 'false' &&
      typeof window.Intercom === 'function' &&
      window.Intercom('update', {
        hide_default_launcher: true,
      });
  });

  const applyConsent = () => {
    window &&
      typeof window.Intercom === 'function' &&
      window.Intercom('update', {
        hide_default_launcher: false,
      });
    setCookieConsent('consented');
  };

  if (cookieConsent === 'consented') {
    return <></>;
  }
  return (
    <CookieConsentBaseContainer consented={cookieConsent}>
      <CookieConsentContents>
        <CookieConsentText>{t('cookie_consent_text')}</CookieConsentText>
        <AcceptConsentButton
          variant="primary"
          size="sm"
          shadowless
          onClick={applyConsent}
        >
          {t('i_agree')}
        </AcceptConsentButton>
      </CookieConsentContents>
    </CookieConsentBaseContainer>
  );
};

export default CookieConsent;
