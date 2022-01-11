import React, { useState } from 'react';
import { isNumber } from 'lodash';
import { Form, Formik, useField } from 'formik';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import ScrollIntoView from '@/components/ScrollIntoView';
import { InfoBox } from '@/components/InfoBox';
import { FieldGroup } from 'src/components/Form/FieldGroup';
import { Submit } from 'src/components/Form/Submit';
import { TextField } from 'src/components/Form/TextInput';
import { Spacer } from 'src/components/layout/Spacer';
import DifficultyWarning from './components/DifficultyWarning';
import AcknowledgeCheckbox from './components/AcknowledgeCheckbox';
import useMinerFarmerDifficultyQuery from '@/hooks/api/useMinerFarmerDifficultyQuery';
import useUpdateFarmerDifficulty from '@/hooks/useUpdateFarmerDifficulty';

export const CheckDifficulty = styled.button`
  height: 48px;
  width: 100%;
  padding: 0 1rem;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
`;

const LauncherIDInput = () => {
  const [launcherId, setLauncherId] = useState<string | undefined>(undefined);
  const [, , newDifficultyHelpers] = useField('newDifficulty');
  const [launcherIDField, , launcherIDHelpers] = useField('launcherID');
  const farmerDifficultyQuery = useMinerFarmerDifficultyQuery(
    { launcherID: launcherId },
    {
      onSuccess: (data) => {
        newDifficultyHelpers.setValue(data.difficulty);
        launcherIDHelpers.setError(undefined);
      },
      onError: () => {
        launcherIDHelpers.setError('Your launcher ID is invalid');
      },
      retry: false,
    }
  );

  return (
    <>
      {isNumber(farmerDifficultyQuery.data?.pendingDifficulty) && (
        <InfoBox variant="primary">
          You have a pending difficulty change of{' '}
          {farmerDifficultyQuery.data?.pendingDifficulty}. Please wait up to 10
          minutes for the changes to be applied.
        </InfoBox>
      )}

      <TextField
        name="launcherID"
        label="Launcher ID"
        desc="Use the Launcher ID to check your current PlotNFT difficulty."
        errorMessage="The launcher ID is invalid, please try again."
        embelishment={
          <CheckDifficulty
            type="button"
            onClick={() => {
              if (launcherIDField.value === launcherId) {
                farmerDifficultyQuery.refetch();
              } else {
                setLauncherId(launcherIDField.value);
              }
            }}
          >
            Check Difficulty
          </CheckDifficulty>
        }
      />
    </>
  );
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const DifficultySettings = () => {
  const { mutateAsync, error } = useUpdateFarmerDifficulty();
  const { t } = useTranslation(['common']);

  const validate = (values) => {
    return sleep(100).then(() => {
      const errors = {} as {
        launcherID: string;
        newDifficulty: string;
        loginLink: string;
      };

      if (values.launcherID === '') {
        errors.launcherID = t('common:errors.required');
      }

      if (values.newDifficulty === '') {
        errors.newDifficulty = t('common:errors.required');
      }

      if (values.loginLink === '') {
        errors.loginLink = t('common:errors.required');
      }

      return errors;
    });
  };

  return (
    <Formik
      onSubmit={({ coin, launcherID, newDifficulty, loginLink }) =>
        mutateAsync({ coin, launcherID, newDifficulty, loginLink })
      }
      initialValues={{
        coin: 'xch',
        launcherID: '',
        newDifficulty: '',
        loginLink: '',
        acknowledge: false,
      }}
      validate={validate}
    >
      {({ values, errors }) => {
        let isAcknowledged = values.acknowledge;

        if (parseInt(values.newDifficulty) <= 1) {
          isAcknowledged = true;
        }

        return (
          <Form>
            <FieldGroup.V>
              <h3>Difficulty Settings</h3>
              <DifficultyWarning />
              {error && (
                <ScrollIntoView>
                  <InfoBox variant="error">{error.error}</InfoBox>
                </ScrollIntoView>
              )}
              <LauncherIDInput />
              <Spacer size="sm" />
              <TextField
                name="newDifficulty"
                label="Difficulty"
                desc="Difficulty determines the frequency of partials. The lower the difficulty is, the more partials you will get. More partials will result in more precise stats."
                placeholder="Check your difficulty with launcher ID"
              />
              <Spacer size="sm" />
              <TextField
                name="loginLink"
                label="Login Link"
                desc="Login Link is required to prove the ownership of your PlotNFT."
              />
              <Spacer size="sm" />

              {Number(values.newDifficulty) > 1 && <AcknowledgeCheckbox />}

              <Submit shape="block" disableWhenFormNotDirty={!isAcknowledged}>
                Apply Changes
              </Submit>
            </FieldGroup.V>
          </Form>
        );
      }}
    </Formik>
  );
};

export default DifficultySettings;
