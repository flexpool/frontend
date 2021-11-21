import React from 'react';
import { Trans } from 'next-i18next';
import { stringUtils } from '@/utils/string.utils';
import { CheckboxField } from '@/components/Form/Checkbox';

const { titleCase } = stringUtils;

type L2AcknowledgeCheckboxProps = {
  network: string;
};

const L2AcknowledgeCheckbox = ({ network }: L2AcknowledgeCheckboxProps) => {
  return (
    <CheckboxField
      label={
        <Trans
          ns="dashboard"
          i18nKey="settings.payout.l2_acknowledge"
          values={{
            network_name: titleCase(network),
          }}
          components={{
            bold: <strong />,
          }}
        />
      }
      name="acknowledge"
    />
  );
};

export default L2AcknowledgeCheckbox;
