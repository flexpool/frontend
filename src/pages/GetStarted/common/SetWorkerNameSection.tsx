import React from 'react';
import { useTranslation } from 'next-i18next';

import { TextField } from 'src/components/Form/TextInput';
import { DivText } from 'src/components/Typo/Typo';
import { Spacer } from 'src/components/layout/Spacer';
import { workerNameCheck } from '@/utils/checks';
import { SectionWrapper } from '../common/SectionWrapper';

// TODO: add wallet name validation

export const SetWorkerNameSection = ({ position }, { position: number }) => {
  const { t } = useTranslation('get-started');

  return (
    <SectionWrapper position={position} title={t('detail.worker.title')}>
      <p>{t('detail.worker.description')}</p>
      <Spacer />
      <DivText>
        <TextField
          label={t('detail.worker.worker_name')}
          name="worker_name"
          placeholder={t('detail.worker.worker_name_placeholder', {
            value: 'alex_rig1',
          })}
          spellCheck="false"
          autoComplete="off"
        />
      </DivText>
    </SectionWrapper>
  );
};
