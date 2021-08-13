import React, { useState, useEffect } from 'react';
import { ButtonGroup } from 'src/pages/GetStarted/ChiaShared/ButtonGroup';
import qs from 'query-string';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export const ButtonGroupFarmerSkExtractionMethodSelector: React.FC<{}> = ({}) => {
  const router = useRouter();

  const { t } = useTranslation('guide-flexfarmer');

  const extractionMethods = {
    browser: { label: t('farmer_secret_key.extraction_methods.browser') },
    python: { label: t('farmer_secret_key.extraction_methods.local') },
  };

  const [selectedMethod, setSelectedMethod] = useState('');
  const [search, setSearch] = useState('');
  const selectMethod = React.useCallback(
    (s: string) => {
      if (typeof window !== 'undefined') {
        setSearch(window.location.search);
      }

      const query = qs.stringify({
        ...qs.parse(window.location.search),
        farmerSkExtractionMethod: s,
      });

      const newUrl = `${router.asPath.split('?')[0]}/?${query}`;

      window.history.pushState(
        { ...window.history.state, as: newUrl, url: newUrl },
        '',
        newUrl
      );
      let queryStringChange = new Event('popstate');
      setSelectedMethod(s);
      window.dispatchEvent(queryStringChange);
    },
    [router]
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearch(window.location.search);
      const method = qs
        .parse(window.location.search)
        .farmerSkExtractionMethod?.toString();
      selectMethod(method ? method : 'browser');
    }
  }, [selectMethod]);

  return (
    <ButtonGroup
      options={extractionMethods}
      selectedOption={selectedMethod}
      setSelectedOption={selectMethod}
    />
  );
};
