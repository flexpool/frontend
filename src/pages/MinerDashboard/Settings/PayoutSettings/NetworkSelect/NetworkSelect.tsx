import React, { useMemo } from 'react';
import styled from 'styled-components';
import { stringUtils } from '@/utils/string.utils';
import { useFormikContext } from 'formik';
import { useTranslation } from 'next-i18next';
import { get } from 'lodash';
import NetworkLogo from '@/components/NetworkLogo';
import { DownshiftSelectField as Select } from '@/components/Form/DownshiftSelect';

const { titleCase } = stringUtils;

const LabelWrap = styled.div`
  display: flex;
  align-items: center;
`;

const NetworkName = styled.span`
  margin-left: 10px;
`;

type OptionLabelProps = {
  ticker: string;
  network: string;
};

const OptionLabel = ({ ticker, network }: OptionLabelProps) => {
  let name = titleCase(network);
  if (network !== 'mainnet') name = `${titleCase(network)} L2`;

  return (
    <LabelWrap>
      <NetworkLogo ticker={ticker} network={network.toLowerCase()} />
      <NetworkName>{name}</NetworkName>
    </LabelWrap>
  );
};

const NetworkOptions = [
  {
    label: <OptionLabel ticker="eth" network="mainnet" />,
    value: 'mainnet',
  },
  {
    label: <OptionLabel ticker="eth" network="polygon" />,
    value: 'polygon',
  },
];

const NetworkSelect = () => {
  const { values } = useFormikContext();
  const { t } = useTranslation(['common']);

  const network = useMemo(() => get(values, 'network'), [values]);

  const description = useMemo(() => {
    if (network === 'polygon') {
      return t('dashboard:settings.payout.eth_polygon');
    }

    return t('dashboard:settings.payout.eth_mainnet');
  }, [network, t]);

  return (
    <Select
      name="network"
      items={NetworkOptions}
      label="Network"
      desc={description}
    />
  );
};

export default NetworkSelect;
