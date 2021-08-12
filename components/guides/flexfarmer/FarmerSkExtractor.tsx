import { Trans, useTranslation } from 'next-i18next';
import React from 'react';
import { Button } from 'src/components/Button';
import { TextInput } from 'src/components/Form/TextInput';
import { mnemonicToSeed, validateMnemonic } from 'src/utils/bip39/bip39';
import { keyGen, derivePath } from 'src/utils/chiacrypto/crypto';
import styled from 'styled-components';
import { BsFillLockFill, BsFillUnlockFill } from 'react-icons/bs';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Spacer } from 'src/components/layout/Spacer';

const MnemonicClearBoxWrapper = styled.div`
  margin-bottom: 1em;
  display: flex;
  width: 100%;
  div:first-child {
    width: 100%;
  }
  Button {
    margin-left: 1em;
    margin-top: 1.625em;
  }
`;

export const FarmerSkExtractor: React.FC<{
  setExternalFarmerSk: (s: string | null) => void;
}> = ({ setExternalFarmerSk }) => {
  const { t } = useTranslation('guide-flexfarmer');
  const [value, setValue] = React.useState('');
  const [mnemonicValid, setMnemonicValid] = React.useState(true);
  const label = 'Mnemonic Phrase';
  const skLabel = 'Farmer Secret Key';
  const [mnemonicVisible, setMnemonicVisible] = React.useState(false);

  const [farmerSk, setFarmerSk] = React.useState<string | null>(null);

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );

  const lockedMessage = t('farmer_secret_key.extractor_locked');

  React.useEffect(() => {
    if (value === lockedMessage) {
      return;
    }

    setFarmerSk(null);
    setExternalFarmerSk(null);
    if (value.length === 0) {
      setMnemonicValid(true);
      return;
    }

    validateMnemonic(value).then((ok) => {
      setMnemonicValid(ok);
      if (ok) {
        mnemonicToSeed(value).then((seed) => {
          keyGen(seed as Buffer).then((masterKey) => {
            derivePath(masterKey, [12381, 8444, 0, 0]).then((farmerSk) => {
              setValue(lockedMessage);
              const sk = '0x' + farmerSk.toString('hex');
              setFarmerSk(sk);
              setExternalFarmerSk(sk);
            });
          });
        });
      }
    });
  }, [value, lockedMessage, setFarmerSk, setExternalFarmerSk]);

  return (
    <>
      <p>
        <Trans
          ns="guide-flexfarmer"
          i18nKey="farmer_secret_key.browser_security_notice"
          components={{ warning: <b /> }}
        />
      </p>
      <Spacer />
      <MnemonicClearBoxWrapper>
        <TextInput
          autoComplete="off"
          spellCheck="false"
          label={label}
          placeholder={
            'suggest sword layer sort scale stone busy prevent dog dad call balance'
          }
          value={value}
          onChange={handleInputChange}
          type={farmerSk === null ? (mnemonicVisible ? 'text' : 'password') : 'text'}
          errorMessage={
            !mnemonicValid ? (
              <Trans
                ns="get-started"
                i18nKey="detail.invalid"
                values={{ value: label }}
              />
            ) : null
          }
          disabled={farmerSk !== null}
        />
        <Button
          onClick={() => setMnemonicVisible(!mnemonicVisible)}
          disabled={farmerSk !== null}
        >
          {mnemonicVisible ? <MdVisibilityOff /> : <MdVisibility />}
        </Button>
        <Button
          disabled={farmerSk === null}
          onClick={() => {
            setValue('');
          }}
        >
          {farmerSk === null ? <BsFillUnlockFill /> : <BsFillLockFill />}
        </Button>
      </MnemonicClearBoxWrapper>
      <TextInput
        autoComplete="off"
        spellCheck="false"
        label={skLabel}
        placeholder={'0x6b0ebe67d0d776896cde822eab776504372928dfbb613ed88c09c18f0e091340'}
        value={farmerSk ? farmerSk : 'N/A'}
        disabled={true}
      />
    </>
  );
};
