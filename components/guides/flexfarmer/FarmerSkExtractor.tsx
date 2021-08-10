import { Trans } from 'next-i18next';
import React from 'react';
import { TextInput } from 'src/components/Form/TextInput';
import { mnemonicToEntropy, validateMnemonic } from 'src/utils/bip39/bip39';

export const FarmerSkExtractor: React.FC<{}> = ({}) => {
  const [value, setValue] = React.useState('');
  const [mnemonicValid, setMnemonicValid] = React.useState(true);
  const label = 'Mnemonic phrase';

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    []
  );

  React.useEffect(() => {
    if (value.length === 0) {
      setMnemonicValid(true);
      return;
    }

    validateMnemonic(value).then((ok) => {
      setMnemonicValid(ok);
    });
  }, [value]);
  return (
    <TextInput
      autoComplete="off"
      spellCheck="false"
      label={label}
      placeholder={
        'suggest sword layer sort scale stone busy prevent dog dad call balance'
      }
      value={value}
      onChange={handleInputChange}
      errorMessage={
        !mnemonicValid ? (
          <Trans ns="get-started" i18nKey="detail.invalid" values={{ value: label }} />
        ) : null
      }
    />
  );
};
