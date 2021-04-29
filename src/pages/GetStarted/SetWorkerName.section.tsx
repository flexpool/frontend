import { useHistory, useLocation } from 'react-router';
import qs from 'query-string';
import { TextInput } from 'src/components/Form/TextInput';
import { DivText, Highlight } from 'src/components/Typo/Typo';
import { Spacer } from 'src/components/layout/Spacer';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const SetWorkerNameSection = () => {
  const history = useHistory();
  const { search } = useLocation();

  const { t } = useTranslation('get-started');

  const value = React.useMemo(() => {
    const parsedSearch = qs.parse(search);
    return parsedSearch.workerName || '';
  }, [search]);

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const parsedSearch = qs.parse(search);
      history.replace({
        search: qs.stringify({
          ...parsedSearch,
          workerName: value,
        }),
      });
    },
    [search, history]
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
