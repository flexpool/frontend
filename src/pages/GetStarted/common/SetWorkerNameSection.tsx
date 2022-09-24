import React from 'react';
import { useTranslation } from 'next-i18next';

import { TextField } from 'src/components/Form/TextInput';
import { DivText } from 'src/components/Typo/Typo';
import { Spacer } from 'src/components/layout/Spacer';
import { workerNameCheck } from '@/utils/checks';
import { SectionWrapper } from '../common/SectionWrapper';

export const SetWorkerNameSection = ({ position, name = 'worker_name' }: { position: number, name?: string }) => {
  const { t } = useTranslation('get-started');

  return (
    <SectionWrapper position={position} title={t('detail.worker.title')}>
      <p>{t('detail.worker.description')}</p>
      <Spacer />
      <DivText>
        <TextField
          validate={(value) => {
            if (value === '' || typeof value === 'undefined') return undefined;
            if (!workerNameCheck(value)) {
              return t('detail.wallet.invalid_worker_name') as string;
            }

            return undefined;
          }}
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
