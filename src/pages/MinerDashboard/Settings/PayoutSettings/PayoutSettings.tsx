import { Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { ErrorBox } from 'src/components/Form/ErrorBox';
import { FieldGroup } from 'src/components/Form/FieldGroup';
import { Submit } from 'src/components/Form/Submit';
import { TextField } from 'src/components/Form/TextInput';
import { Spacer } from 'src/components/layout/Spacer';
import {
  useActiveCoin,
  useActiveCoinTicker,
} from 'src/rdx/localSettings/localSettings.hooks';
import { useFeePayoutLimitDetails } from 'src/hooks/useFeePayoutDetails';
import useClientIPQuery from '@/hooks/api/useClientIPQuery';
import useMinerDetailsQuery from '@/hooks/api/useMinerDetailsQuery';
import useUpdatePayoutSettings from '@/hooks/useUpdatePayoutSettings';
import { useReduxState } from 'src/rdx/useReduxState';
import { useTranslation } from 'next-i18next';
import { useLocalizedNumberFormatter } from 'src/utils/si.utils';
import { getDecimalPlace } from '@/utils/number.utils';
import styled from 'styled-components';
import PayoutWarning from './PayoutWarning';
import L2Warning from './L2Warning';
import NetworkSelect from './NetworkSelect';
import ThresholdInput from './ThresholdInput';
import GasPriceInput from './GasPriceInput';
import GasPricePercentInput from './GasPricePercentInput';
import L2AcknowledgeCheckbox from './L2AcknowledgeCheckbox';
import ScrollIntoView from '@/components/ScrollIntoView';

export const LowPayoutContainer = styled.div`
  color: var(--danger);
`;

export const PayoutSettings: React.FC<{
  address: string;
}> = ({ address }) => {
  const activeCoinTicker = useActiveCoinTicker();
  const activeCoin = useActiveCoin();
  const minerHeaderStats = useReduxState('minerHeaderStats');
  const { t } = useTranslation(['common']);
  const numberFormatter = useLocalizedNumberFormatter();

  const { data: minerDetails } = useMinerDetailsQuery({
    coin: activeCoinTicker,
    address,
  });

  const { mutateAsync, error } = useUpdatePayoutSettings();

  const { data: clientIP } = useClientIPQuery();

  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);
  const [gweiToggle, setGweiToggle] = React.useState(true);
  if (!minerDetails || !activeCoin || !feeDetails || !minerHeaderStats.data) {
    return null;
  }

  const toggleGwei = () => {
    setGweiToggle(!gweiToggle);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const validate = (values) => {
    return sleep(100).then(() => {
      const errors = {} as {
        payoutLimit: string;
        maxFeePrice: Number;
        maxFeePricePercent: Number;
        ip: string;
      };
      if (values.payoutLimit < 0) {
        errors.payoutLimit = t('common:errors.required', { value: 0 });
      }

      if (getDecimalPlace(values.payoutLimit) > 4) {
        errors.payoutLimit = t('common:errors.decimal_places', {
          value: 4,
        });
      }

      const ipv4Regex = /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/;
      const ipv6Regex =
        /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gi;
      const specialRegex = /^([^:]+):([^:]+)$/;

      if (values.ip === '') {
        errors.ip = t('common:errors.required');
      } else if (
        !ipv4Regex.test(values.ip) &&
        !ipv6Regex.test(values.ip) &&
        !specialRegex.test(values.ip)
      ) {
        errors.ip = t('common:errors.invalid_ip');
      }

      return errors;
    });
  };

  return (
    <Formik
      onSubmit={async (data) => {
        return mutateAsync({
          address: address,
          coin: activeCoin.ticker,
          payoutLimit:
            Number(data.payoutLimit) * Math.pow(10, activeCoin.decimalPlaces),
          maxFeePrice: gweiToggle
            ? Number(data.maxFeePrice)
            : Math.round(
                ((Number(data.maxFeePricePercent) / 100) *
                  Math.pow(10, activeCoin.decimalPlaces) *
                  Number(
                    minerDetails.payoutLimit /
                      Math.pow(10, activeCoin.decimalPlaces)
                  )) /
                  activeCoin.transactionSize /
                  feeDetails.multiplier
              ),
          ipAddress: data.ip,
          network: data.network,
        });
      }}
      initialValues={{
        maxFeePrice: `${minerDetails.maxFeePrice}`,
        maxFeePricePercent: numberFormatter(
          ((Number(minerDetails.maxFeePrice) *
            activeCoin.transactionSize *
            feeDetails.multiplier) /
            Math.pow(10, activeCoin.decimalPlaces) /
            Number(
              minerDetails.payoutLimit / Math.pow(10, activeCoin.decimalPlaces)
            )) *
            100,
          { style: 'decimal', maximumFractionDigits: 6 }
        ),
        ip: '',
        payoutLimit: `${
          minerDetails.payoutLimit / Math.pow(10, activeCoin.decimalPlaces)
        }`,
        network: minerDetails.network,
        acknowledge: false,
      }}
      validateOnChange={true}
      validate={validate}
      enableReinitialize
      // validationSchema={validationSchema}
    >
      {({ values }) => {
        let isAcknowledged = values.acknowledge;

        // No need to verify acknowledgement if the user is using mainnet
        if (values.network === 'mainnet') {
          isAcknowledged = true;
        }

        return (
          <>
            <Form>
              <FieldGroup.V>
                <h3>{t('dashboard:settings.payout.title')}</h3>

                {String(activeCoin?.ticker) === 'eth' &&
                  values.network === 'mainnet' && <PayoutWarning />}

                {error && (
                  <ScrollIntoView>
                    <ErrorBox error={error} />
                  </ScrollIntoView>
                )}

                {values.network !== 'mainnet' && (
                  <L2Warning network={values.network} />
                )}

                {String(activeCoin?.ticker) === 'eth' && <NetworkSelect />}

                <Spacer size="sm" />

                <ThresholdInput
                  name="payoutLimit"
                  isMainnet={values.network === 'mainnet'}
                />

                <Spacer size="sm" />

                {String(activeCoin?.ticker) === 'eth' &&
                  values.network === 'mainnet' && (
                    <>
                      {gweiToggle ? (
                        <GasPriceInput onToggle={toggleGwei} />
                      ) : (
                        <GasPricePercentInput
                          onToggle={toggleGwei}
                          address={address}
                        />
                      )}

                      <Spacer size="sm" />
                    </>
                  )}

                <TextField
                  name="ip"
                  label={`${t('dashboard:settings.ip')}*`}
                  placeholder={minerDetails.ipAddress}
                />
                <div>
                  <p>
                    <i>*{t('dashboard:settings.ip_caption')}</i>
                  </p>
                  <p>
                    {t('dashboard:settings.ip_hint')} <b>{clientIP || ''}</b>
                  </p>
                  <p>{t('dashboard:settings.ip_description')} </p>
                </div>

                {activeCoin.ticker === 'eth' &&
                values.network === 'mainnet' &&
                Number(values.payoutLimit) < 0.05 ? (
                  <LowPayoutContainer>
                    {t('dashboard:settings.high_fees_warning')}
                  </LowPayoutContainer>
                ) : (
                  ''
                )}

                <Spacer size="sm" />

                {values.network !== 'mainnet' && (
                  <L2AcknowledgeCheckbox network={values.network} />
                )}

                <Submit shape="block" disableWhenFormNotDirty={!isAcknowledged}>
                  {t('dashboard:settings.payout.submit')}
                </Submit>
              </FieldGroup.V>
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default PayoutSettings;
