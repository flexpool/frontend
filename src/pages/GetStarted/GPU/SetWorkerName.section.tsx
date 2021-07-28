import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import qs from 'query-string';

// import { useHistory, useLocation } from 'react-router';
import { TextInput } from 'src/components/Form/TextInput';
import { DivText, Highlight } from 'src/components/Typo/Typo';
import { Spacer } from 'src/components/layout/Spacer';

export const SetWorkerNameSection = () => {
  const router = useRouter();
  const ticker = router.query.ticker;
  let search;

  if (typeof window !== 'undefined') {
    search = window.location.search;
  }

  const { t } = useTranslation('get-started');

  const value = React.useMemo(() => {
    const parsedSearch = qs.parse(search);
    return parsedSearch.workerName || '';
  }, [search]);

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const parsedSearch = qs.parse(search);

      router.push({
        pathname: window.location.pathname,
        query: {
          ...parsedSearch,
          workerName: value,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]
  );

  return (
    <>
      <h2>
        <Highlight>#3</Highlight> {t('detail.worker.title')}
      </h2>
      <p>{t('detail.worker.description')}</p>
      <Spacer />
      <DivText>
        <TextInput
          label={t('detail.worker.worker_name')}
          placeholder={t('detail.worker.worker_name_placeholder')}
          value={value}
          onChange={handleInputChange}
          spellCheck="false"
          autoComplete="off"
        />
      </DivText>
    </>
  );
};
