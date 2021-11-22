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
import { minerDetailsUpdatePayoutSettings } from 'src/rdx/minerDetails/minerDetails.actions';
import { minerDetailsGet } from 'src/rdx/minerDetails/minerDetails.actions';
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
  const minerSettings = useReduxState('minerDetails');
  const minerHeaderStats = useReduxState('minerHeaderStats');
  const { t } = useTranslation(['common']);
  const numberFormatter = useLocalizedNumberFormatter();
  const d = useDispatch();

  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);
  const [gweiToggle, setGweiToggle] = React.useState(true);
  if (
    !minerSettings.data ||
    !activeCoin ||
    !feeDetails ||
    !minerHeaderStats.data
  ) {
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

      if (values.ip === '') {
        errors.ip = t('common:errors.required');
      }
      return errors;
    });
  };

  return (
    <Formik
      onSubmit={async (data) => {
        return Promise.all([
          d(
            minerDetailsUpdatePayoutSettings(activeCoin.ticker, address, {
              payoutLimit:
                Number(data.payoutLimit) *
                Math.pow(10, activeCoin.decimalPlaces),
              maxFeePrice: gweiToggle
                ? Number(data.maxFeePrice)
                : Math.round(
                    ((Number(data.maxFeePricePercent) / 100) *
                      Math.pow(10, activeCoin.decimalPlaces) *
                      Number(
                        minerSettings &&
                          minerSettings.data &&
                          minerSettings.data.payoutLimit /
                            Math.pow(10, activeCoin.decimalPlaces)
                      )) /
                      activeCoin.transactionSize /
                      feeDetails.multiplier
                  ),
              ipAddress: data.ip,
              network: data.network,
            })
          ),
        ]).then(() => {
          d(minerDetailsGet(activeCoin.ticker, address));
        });
      }}
      initialValues={{
        maxFeePrice: `${minerSettings.data.maxFeePrice}`,
        maxFeePricePercent: numberFormatter(
          ((Number(minerSettings.data.maxFeePrice) *
            activeCoin.transactionSize *
            feeDetails.multiplier) /
            Math.pow(10, activeCoin.decimalPlaces) /
            Number(
              minerSettings.data.payoutLimit /
                Math.pow(10, activeCoin.decimalPlaces)
            )) *
            100,
          { style: 'decimal', maximumFractionDigits: 6 }
        ),
        ip: '',
        payoutLimit: `${
          minerSettings.data.payoutLimit /
          Math.pow(10, activeCoin.decimalPlaces)
        }`,
        network: minerSettings.data.network,
        acknowledge: false,
      }}
      validateOnChange={true}
      validate={validate}
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

                {minerSettings.error && (
                  <ScrollIntoView>
                    <ErrorBox error={minerSettings.error} />
                  </ScrollIntoView>
                )}

                {values.network !== 'mainnet' && (
                  <L2Warning network={values.network} />
                )}

                {String(activeCoin?.ticker) === 'eth' && <NetworkSelect />}

                <ThresholdInput name="payoutLimit" />

                {String(activeCoin?.ticker) === 'eth' &&
                  values.network === 'mainnet' &&
                  (gweiToggle ? (
                    <GasPriceInput onToggle={toggleGwei} />
                  ) : (
                    <GasPricePercentInput onToggle={toggleGwei} />
                  ))}

                <Spacer />
                <TextField
                  name="ip"
                  label={`${t('dashboard:settings.ip')}*`}
                  placeholder={minerSettings.data!.ipAddress}
                />
                <div>
                  <p>
                    <i>*{t('dashboard:settings.ip_caption')}</i>
                  </p>
                  <p>
                    {t('dashboard:settings.ip_hint')}{' '}
                    <b>{minerSettings.data!.clientIPAddress}</b>.
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
