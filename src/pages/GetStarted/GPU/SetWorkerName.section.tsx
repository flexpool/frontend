import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import qs from 'query-string';

// import { useHistory, useLocation } from 'react-router';
import { TextInput } from 'src/components/Form/TextInput';
import { DivText, Highlight } from 'src/components/Typo/Typo';
import { Spacer } from 'src/components/layout/Spacer';
import { workerNameCheck } from '@/utils/checks';

const getLocationSearch = () => {
  return typeof window !== 'undefined' ? window.location.search : '';
};

export const SetWorkerNameSection = () => {
  const router = useRouter();
  const { t } = useTranslation('get-started');

  const initValue = React.useMemo(() => {
    const parsedSearch = qs.parse(getLocationSearch());
    return parsedSearch.workerName || '';
    // eslint-disable-next-line
  }, []);

  const [value, setValue] = React.useState(initValue || '');

  const [workerNameCheckFailed, setWorkerNameCheckFailed] =
    React.useState(false);

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(value);

      if (!workerNameCheck(value)) {
        setWorkerNameCheckFailed(true);
        return;
      }

      setWorkerNameCheckFailed(false);

      const parsedSearch = qs.parse(getLocationSearch());

      const query = qs.stringify({
        ...parsedSearch,
        workerName: value,
      });

      const newUrl = `${router.asPath.split('?')[0]}/?${query}`;

      window.history.replaceState(
        { ...window.history.state, as: newUrl, url: newUrl },
        '',
        newUrl
      );

      let queryStringChange = new Event('popstate');
      window.dispatchEvent(queryStringChange);

      setValue(value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
          placeholder={t('detail.worker.worker_name_placeholder', {
            value: 'alex_rig1',
          })}
          value={value}
          onChange={handleInputChange}
          spellCheck="false"
          autoComplete="off"
          errorMessage={
            workerNameCheckFailed && t('detail.wallet.invalid_worker_name')
          }
        />
      </DivText>
    </>
  );
};
