import React from 'react';
import { Trans } from 'next-i18next';
import { stringUtils } from '@/utils/string.utils';
import { InfoBox } from '@/components/InfoBox';

const { titleCase } = stringUtils;

type L2WarningProps = {
  network: string;
};

const L2Warning = ({ network }: L2WarningProps) => {
  return (
    <InfoBox variant="warning">
      <h3>Important note</h3>
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
