import React, { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { TextInput } from 'src/components/Form/TextInput';
import { Trans, useTranslation } from 'next-i18next';
import { getLocationSearch } from 'utils/url';
import qs from 'query-string';

const GuideInput: React.FC<{
  className: string;
  label: string;
  placeholderText: string;
  param?: string;
  setExternalValue?: (value: string | null) => void;
  regexp?: RegExp;
  verifyFunc?: (s: string) => boolean;
}> = ({
  className,
  label,
  placeholderText,
  param,
  setExternalValue,
  regexp,
  verifyFunc,
}) => {
  const initValue = useMemo(() => {
    const parsedSearch = qs.parse(getLocationSearch());
    return parsedSearch.walletAddress || '';
    // eslint-disable-next-line
  }, []);

  if (regexp === undefined) {
    regexp = /.*/;
  }

  const [value, setValue] = useState(initValue || '');
  const [valueValid, setValueValid] = useState(true);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(value);

      var valid = false;

      if (value === '') {
        valid = true;
      } else {
        if (verifyFunc !== undefined) {
          valid = verifyFunc(value);
        } else {
          valid = regexp?.test(value) as boolean;
        }
      }

      if (setExternalValue !== undefined) {
        if (valid) {
          setExternalValue(value);
        } else {
          setExternalValue(null);
        }
      }

      setValueValid(valid);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className={className}>
      <TextInput
        autoComplete="off"
        spellCheck="false"
        label={label}
        placeholder={placeholderText}
        value={value}
        onChange={handleInputChange}
        errorMessage={
          !valueValid ? (
            <Trans ns="get-started" i18nKey="detail.invalid" values={{ value: label }} />
          ) : null
        }
      />
    </div>
  );
};

export default GuideInput;
