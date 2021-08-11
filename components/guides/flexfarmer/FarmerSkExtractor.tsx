import { Trans } from 'next-i18next';
import React from 'react';
import { TextInput } from 'src/components/Form/TextInput';
import { mnemonicToSeed, validateMnemonic } from 'src/utils/bip39/bip39';
import { keyGen, derivePath } from 'src/utils/chiacrypto/crypto';

export const FarmerSkExtractor: React.FC<{}> = ({}) => {
  const [value, setValue] = React.useState('');
  const [mnemonicValid, setMnemonicValid] = React.useState(true);
  const label = 'Mnemonic phrase';

  const [farmerSk, setFarmerSk] = React.useState('N/A');

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );

  React.useEffect(() => {
    setFarmerSk('N/A');
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
              setFarmerSk('0x' + farmerSk.toString('hex'));
            });
          });
        });
      }
    });
  }, [value]);

  return (
    <>
      <TextInput
        autoComplete="off"
        spellCheck="false"
        label={label}
        placeholder={
          'suggest sword layer sort scale stone busy prevent dog dad call balance'
        }
        value={value}
        onChange={handleInputChange}
        type="password"
        errorMessage={
          !mnemonicValid ? (
            <Trans ns="get-started" i18nKey="detail.invalid" values={{ value: label }} />
          ) : null
        }
      />
      {farmerSk}
    </>
  );
};
