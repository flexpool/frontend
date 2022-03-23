import React from 'react';
import { Trans, useTranslation } from 'next-i18next';
import { stringUtils } from '@/utils/string.utils';
import { InfoBox } from '@/components/InfoBox';

const { titleCase } = stringUtils;

type L2WarningProps = {
  network: string;
};

const L2Warning = ({ network }: L2WarningProps) => {
  const { t } = useTranslation(['common']);

  return (
    <InfoBox variant="warning">
      <h3>{t('dashboard:settings.important_note')}</h3>
      <Trans
        ns="dashboard"
        i18nKey="settings.payout.l2_warning"
        values={{ network_name: titleCase(network) }}
        components={{
          bold: <strong />,
        }}
      />
    </InfoBox>
  );
};

export default L2Warning;
