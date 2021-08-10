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
  let search: string;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      search = window.location.search;
      const method = qs.parse(search).farmerSkExtractionMethod?.toString();
      selectMethod(method ? method : 'browser');
    }
  }, []);

  const selectMethod = (s: string) => {
    if (typeof window !== 'undefined') {
      search = window.location.search;
    }

    const query = qs.stringify({
      ...qs.parse(search),
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
  };

  return (
    <ButtonGroup
      options={extractionMethods}
      selectedOption={selectedMethod}
      setSelectedOption={selectMethod}
    />
  );
};
