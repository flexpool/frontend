import { Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
// import { useRouteMatch } from 'react-router';
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
import * as yup from 'yup';
import { setLocale } from 'yup';
import { useTranslation } from 'next-i18next';
import {
  useLocalizedCurrencyFormatter,
  useLocalizedNumberFormatter,
} from 'src/utils/si.utils';
import { InfoBox } from 'src/components/InfoBox';
import styled from 'styled-components';

export const GweiToggle = styled.button`
  height: 48px;
  width: 100%;
  padding: 0 1rem;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UnitContainer = styled.div`
  padding: 0 1rem;
`;

export const ActiveToggleText = styled.span`
  color: var(--text-primary);
`;
export const InactiveToggleText = styled.span`
  color: var(--text-tertiary);
`;

export const PercentageDisplaySpan = styled.span<{ color?: string }>`
  ${(p) =>
    p.color === 'yellow' &&
    `
          color: var(--warning);
          `}
  ${(p) =>
    p.color === 'red' &&
    `
      color: var(--danger);
      `}
`;
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
  const currencyFormatter = useLocalizedCurrencyFormatter();
  const [gweiToggle, setGweiToggle] = React.useState(true);
  if (
    !minerSettings.data ||
    !activeCoin ||
    !feeDetails ||
    !minerHeaderStats.data
  ) {
    return null;
  }

  const minPayoutLimit =
    activeCoin.lowestMinPayoutThreshold /
    Math.pow(10, activeCoin.decimalPlaces);

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

      if (
        values.payoutLimit &&
        values.payoutLimit.toString().split('.')[1] &&
        values.payoutLimit.toString().split('.')[1].length > 4
      ) {
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
      onSubmit={async (data, { setSubmitting }) => {
        Promise.all([
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
            })
          ),
        ]).then(() => {
          d(minerDetailsGet(activeCoin.ticker, address));
        });
        setSubmitting(false);
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
      }}
      validateOnChange={true}
      validate={validate}
      // validationSchema={validationSchema}
    >
      {({ values }) => {
        return (
          <>
            <Form>
              <FieldGroup.V>
                <h3>{t('dashboard:settings.payout.title')}</h3>

                {String(activeCoin?.ticker) === 'eth' ? (
                  <InfoBox variant="warning">
                    <h3>Important note</h3>
                    <div>
                      {(
                        t('dashboard:settings.payout_warning', {
                          returnObjects: true,
                        }) as string[]
                      ).map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  </InfoBox>
                ) : null}
                <ErrorBox error={minerSettings.error} />
                <TextField
                  name="payoutLimit"
                  label={t('dashboard:settings.payout.limit', {
                    min: minPayoutLimit,
                  })}
                  embelishment={
                    activeCoinTicker.toUpperCase() ? (
                      <UnitContainer>
                        {activeCoinTicker.toUpperCase()}
                      </UnitContainer>
                    ) : undefined
                  }
                  inputMode="decimal"
                  desc={t('dashboard:settings.payout.limit_desc', {
                    value: `${
                      values.payoutLimit
                    } ${activeCoin.ticker.toUpperCase()}`,
                  })}
                />

                {String(activeCoin?.ticker) === 'eth' ? (
                  gweiToggle ? (
                    <TextField
                      name="maxFeePrice"
                      label={t('dashboard:settings.payout.gas_limit')}
                      embelishment={
                        feeDetails?.unit.toUpperCase() ? (
                          <GweiToggle type="button" onClick={toggleGwei}>
                            <ActiveToggleText>
                              {feeDetails?.unit.toUpperCase()}
                            </ActiveToggleText>
                            <InactiveToggleText>
                              &nbsp;/&nbsp;%
                            </InactiveToggleText>
                          </GweiToggle>
                        ) : undefined
                      }
                      inputMode="decimal"
                      desc={
                        <>
                          <p>
                            {Number(values.maxFeePrice) > 0 ? (
                              <>
                                {t('dashboard:settings.payout.gas_limit_desc', {
                                  value: Number(values.maxFeePrice),
                                  valueUnit: feeDetails?.unit,
                                  valueTicker: currencyFormatter(
                                    ((Number(values.maxFeePrice) *
                                      activeCoin.transactionSize *
                                      feeDetails.multiplier) /
                                      Math.pow(10, activeCoin.decimalPlaces)) *
                                      minerHeaderStats.data!.countervaluePrice
                                  ),
                                }).substring(
                                  0,
                                  Number(
                                    t(
                                      'dashboard:settings.payout.gas_limit_desc',
                                      {
                                        value: Number(values.maxFeePrice),
                                        valueUnit: feeDetails?.unit,
                                        valueTicker: currencyFormatter(
                                          ((Number(values.maxFeePrice) *
                                            activeCoin.transactionSize *
                                            feeDetails.multiplier) /
                                            Math.pow(
                                              10,
                                              activeCoin.decimalPlaces
                                            )) *
                                            minerHeaderStats.data!
                                              .countervaluePrice
                                        ),
                                      }
                                    ).indexOf('{delimiter}')
                                  )
                                )}
                                <PercentageDisplaySpan
                                  color={
                                    Number(
                                      numberFormatter(
                                        ((Number(values.maxFeePrice) *
                                          activeCoin.transactionSize *
                                          feeDetails.multiplier) /
                                          Math.pow(
                                            10,
                                            activeCoin.decimalPlaces
                                          ) /
                                          Number(values.payoutLimit)) *
                                          100,
                                        {
                                          style: 'decimal',
                                          maximumFractionDigits: 3,
                                        }
                                      )
                                    ) >= 10
                                      ? 'red'
                                      : Number(
                                          numberFormatter(
                                            ((Number(values.maxFeePrice) *
                                              activeCoin.transactionSize *
                                              feeDetails.multiplier) /
                                              Math.pow(
                                                10,
                                                activeCoin.decimalPlaces
                                              ) /
                                              Number(values.payoutLimit)) *
                                              100,
                                            {
                                              style: 'decimal',
                                              maximumFractionDigits: 3,
                                            }
                                          )
                                        ) >= 5
                                      ? 'yellow'
                                      : ''
                                  }
                                >
                                  {numberFormatter(
                                    (Number(values.maxFeePrice) *
                                      activeCoin.transactionSize *
                                      feeDetails.multiplier) /
                                      Math.pow(10, activeCoin.decimalPlaces) /
                                      Number(values.payoutLimit),
                                    {
                                      style: 'percent',
                                      maximumFractionDigits: 3,
                                    }
                                  )}
                                </PercentageDisplaySpan>
                                {t('dashboard:settings.payout.gas_limit_desc', {
                                  value: Number(values.maxFeePrice),
                                  valueUnit: feeDetails?.unit,
                                  valueTicker: currencyFormatter(
                                    ((Number(values.maxFeePrice) *
                                      activeCoin.transactionSize *
                                      feeDetails.multiplier) /
                                      Math.pow(10, activeCoin.decimalPlaces)) *
                                      minerHeaderStats.data!.countervaluePrice
                                  ),
                                }).substring(
                                  Number(
                                    t(
                                      'dashboard:settings.payout.gas_limit_desc',
                                      {
                                        value: Number(values.maxFeePrice),
                                        valueUnit: feeDetails?.unit,
                                        valueTicker: currencyFormatter(
                                          ((Number(values.maxFeePrice) *
                                            activeCoin.transactionSize *
                                            feeDetails.multiplier) /
                                            Math.pow(
                                              10,
                                              activeCoin.decimalPlaces
                                            )) *
                                            minerHeaderStats.data!
                                              .countervaluePrice
                                        ),
                                      }
                                    ).indexOf('{delimiter}') + 11
                                  )
                                )}
                              </>
                            ) : (
                              t('dashboard:settings.payout.gas_limit_zero')
                            )}
                          </p>
                        </>
                      }
                    />
                  ) : (
                    <TextField
                      name="maxFeePricePercent"
                      label={t('dashboard:settings.payout.gas_limit')}
                      embelishment={
                        feeDetails?.unit.toUpperCase() ? (
                          <GweiToggle type="button" onClick={toggleGwei}>
                            <InactiveToggleText>
                              {feeDetails?.unit.toUpperCase()}&nbsp;/&nbsp;
                            </InactiveToggleText>
                            <ActiveToggleText>%</ActiveToggleText>
                          </GweiToggle>
                        ) : undefined
                      }
                      inputMode="decimal"
                      desc={
                        <>
                          <p>
                            {Number(values.maxFeePricePercent) > 0 ? (
                              <>
                                {t('dashboard:settings.payout.gas_limit_desc', {
                                  value: Math.round(
                                    ((Number(values.maxFeePricePercent) / 100) *
                                      Math.pow(10, activeCoin.decimalPlaces) *
                                      Number(
                                        minerSettings &&
                                          minerSettings.data &&
                                          minerSettings.data.payoutLimit /
                                            Math.pow(
                                              10,
                                              activeCoin.decimalPlaces
                                            )
                                      )) /
                                      activeCoin.transactionSize /
                                      feeDetails.multiplier
                                  ),
                                  valueUnit: feeDetails?.unit,
                                  valueTicker: currencyFormatter(
                                    ((Math.round(
                                      ((Number(values.maxFeePricePercent) /
                                        100) *
                                        Math.pow(10, activeCoin.decimalPlaces) *
                                        Number(
                                          minerSettings &&
                                            minerSettings.data &&
                                            minerSettings.data.payoutLimit /
                                              Math.pow(
                                                10,
                                                activeCoin.decimalPlaces
                                              )
                                        )) /
                                        activeCoin.transactionSize /
                                        feeDetails.multiplier
                                    ) *
                                      activeCoin.transactionSize *
                                      feeDetails.multiplier) /
                                      Math.pow(10, activeCoin.decimalPlaces)) *
                                      minerHeaderStats.data!.countervaluePrice
                                  ),
                                }).substring(
                                  0,
                                  Number(
                                    t(
                                      'dashboard:settings.payout.gas_limit_desc',
                                      {
                                        value: Number(values.maxFeePrice),
                                        valueUnit: feeDetails?.unit,
                                        valueTicker: currencyFormatter(
                                          ((Number(values.maxFeePrice) *
                                            activeCoin.transactionSize *
                                            feeDetails.multiplier) /
                                            Math.pow(
                                              10,
                                              activeCoin.decimalPlaces
                                            )) *
                                            minerHeaderStats.data!
                                              .countervaluePrice
                                        ),
                                      }
                                    ).indexOf('{delimiter}')
                                  )
                                )}

                                <PercentageDisplaySpan
                                  color={
                                    Number(values.maxFeePricePercent) >= 10
                                      ? 'red'
                                      : Number(values.maxFeePricePercent) >= 5
                                      ? 'yellow'
                                      : ''
                                  }
                                >
                                  {values.maxFeePricePercent}%
                                </PercentageDisplaySpan>
                                {t('dashboard:settings.payout.gas_limit_desc', {
                                  value: Math.round(
                                    ((Number(values.maxFeePricePercent) / 100) *
                                      Math.pow(10, activeCoin.decimalPlaces) *
                                      Number(
                                        minerSettings &&
                                          minerSettings.data &&
                                          minerSettings.data.payoutLimit /
                                            Math.pow(
                                              10,
                                              activeCoin.decimalPlaces
                                            )
                                      )) /
                                      activeCoin.transactionSize /
                                      feeDetails.multiplier
                                  ),
                                  valueUnit: feeDetails?.unit,
                                  valueTicker: currencyFormatter(
                                    ((Math.round(
                                      ((Number(values.maxFeePricePercent) /
                                        100) *
                                        Math.pow(10, activeCoin.decimalPlaces) *
                                        Number(
                                          minerSettings &&
                                            minerSettings.data &&
                                            minerSettings.data.payoutLimit /
                                              Math.pow(
                                                10,
                                                activeCoin.decimalPlaces
                                              )
                                        )) /
                                        activeCoin.transactionSize /
                                        feeDetails.multiplier
                                    ) *
                                      activeCoin.transactionSize *
                                      feeDetails.multiplier) /
                                      Math.pow(10, activeCoin.decimalPlaces)) *
                                      minerHeaderStats.data!.countervaluePrice
                                  ),
                                }).substring(
                                  Number(
                                    t(
                                      'dashboard:settings.payout.gas_limit_desc',
                                      {
                                        value: Number(values.maxFeePrice),
                                        valueUnit: feeDetails?.unit,
                                        valueTicker: currencyFormatter(
                                          ((Number(values.maxFeePrice) *
                                            activeCoin.transactionSize *
                                            feeDetails.multiplier) /
                                            Math.pow(
                                              10,
                                              activeCoin.decimalPlaces
                                            )) *
                                            minerHeaderStats.data!
                                              .countervaluePrice
                                        ),
                                      }
                                    ).indexOf('{delimiter}') + 11
                                  )
                                )}
                              </>
                            ) : (
                              t('dashboard:settings.payout.gas_limit_zero')
                            )}
                          </p>
                        </>
                      }
                    />
                  )
                ) : null}

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
                Number(values.payoutLimit) < 0.05 ? (
                  <LowPayoutContainer>
                    {t('dashboard:settings.high_fees_warning')}
                  </LowPayoutContainer>
                ) : (
                  ''
                )}
                <Submit shape="block">
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
