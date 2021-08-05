import React, { useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { TextInput } from 'src/components/Form/TextInput';
import { Trans, useTranslation } from 'next-i18next';
import { getLocationSearch } from 'utils/url';
import qs from 'query-string';

function GuideInput({ className, label, placeholderText, param }) {
  const initValue = useMemo(() => {
    const parsedSearch = qs.parse(getLocationSearch());
    return parsedSearch.walletAddress || '';
    // eslint-disable-next-line
  }, []);

  const router = useRouter();
  const [value, setValue] = useState(initValue || '');

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const parsedSearch = qs.parse(getLocationSearch());
      setValue(value);

      const query = qs.stringify({
        ...parsedSearch,
        [param]: value ? value : '',
      });
      const newUrl = `${router.asPath.split('?')[0]}/?${query}`;
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
      let queryStringChange = new Event('popstate');
      window.dispatchEvent(queryStringChange);
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
        // errorMessage={checksumError ? t('detail.wallet.invalid_address') : null}
      />
    </div>
  );
}

export default GuideInput;
