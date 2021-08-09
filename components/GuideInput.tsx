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
  setExternalValue?: (value: string) => void;
  regexp?: RegExp;
}> = ({ className, label, placeholderText, param, setExternalValue, regexp }) => {
  const initValue = useMemo(() => {
    const parsedSearch = qs.parse(getLocationSearch());
    return parsedSearch.walletAddress || '';
    // eslint-disable-next-line
  }, []);

  if (regexp === undefined) {
    regexp = /.*/;
  }

  const router = useRouter();
  const [value, setValue] = useState(initValue || '');

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      const parsedSearch = qs.parse(getLocationSearch());
      setValue(value);
      if (!(regexp?.test(value as string) || value === '')) {
        return;
      }

      if (param !== undefined) {
        const query = qs.stringify({
          ...parsedSearch,
          [param]: value ? value : '',
        });
        const newUrl = `${router.asPath.split('?')[0]}/?${query}`;
        window.history.replaceState(
          { ...window.history.state, as: newUrl, url: newUrl },
          '',
          newUrl
        );
        let queryStringChange = new Event('popstate');
        window.dispatchEvent(queryStringChange);
      } else if (setExternalValue !== undefined) {
        setExternalValue(value);
      } else {
        throw Error('No set value action specified');
      }
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
          !regexp.test(value as string) && value !== '' ? (
            <Trans ns="get-started" i18nKey="detail.invalid" values={{ value: label }} />
          ) : null
        }
      />
    </div>
  );
};

export default GuideInput;
