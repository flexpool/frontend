import React from 'react';
import styled from 'styled-components';
import { Button } from 'src/components/Button';
import { useLocalStorageState } from 'src/hooks/useLocalStorageState';

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

  return (
    <CookieConsentBaseContainer consented={cookieConsent}>
      <CookieConsentContents>
        <CookieConsentText>
          This website uses cookies to enhance the user experience.
        </CookieConsentText>
        <Button
          variant="primary"
          size="sm"
          shadowless
          onClick={() => {
            setCookieConsent('consented');
          }}
        >
          I Agree
        </Button>
      </CookieConsentContents>
    </CookieConsentBaseContainer>
  );
};

export default CookieConsent;
