import React, { useState } from 'react';
import { isNumber } from 'lodash';
import { Form, Formik } from 'formik';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import ScrollIntoView from '@/components/ScrollIntoView';
import { InfoBox } from '@/components/InfoBox';
import { FieldGroup } from 'src/components/Form/FieldGroup';
import { LoaderSpinner } from '@/components/Loader/LoaderSpinner';
import { Submit } from 'src/components/Form/Submit';
import { TextField, TextInput } from 'src/components/Form/TextInput';
import { Spacer } from 'src/components/layout/Spacer';
import { Divider } from '@/components/layout/Divider';
import DifficultyWarning from './components/DifficultyWarning';
import AcknowledgeCheckbox from './components/AcknowledgeCheckbox';
import useMinerFarmerDifficultyQuery from '@/hooks/api/useMinerFarmerDifficultyQuery';
import useUpdateFarmerDifficulty from '@/hooks/useUpdateFarmerDifficulty';
import { Button } from '@/components/Button';

const Loader = styled(LoaderSpinner)`
  width: 32px;
  height: 32px;

  svg {
    circle {
      stroke: var(--text-secondary);
    }
  }
`;

const CheckButton = styled(Button)`
  border-radius: 0px;
  width: 120px;
  justify-content: center;
  color: var(--text-primary);
  border: none;
  background: none;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.85rem;
`;

const LauncherIDInput = () => {
  const [launcherId, setLauncherId] = useState<string | undefined>(undefined);
  const [input, setInput] = useState('');
  const farmerDifficultyQuery = useMinerFarmerDifficultyQuery(
    { launcherID: launcherId },
    {
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

      <TextInput
        label="Launcher ID"
        desc="Use the Launcher ID to check your current PlotNFT difficulty."
        errorMessage={
          farmerDifficultyQuery.error
            ? 'The launcher ID is invalid, please try again.'
            : undefined
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
        embelishment={
          <CheckButton
            type="button"
            onClick={() => {
              if (input === launcherId) {
                farmerDifficultyQuery.refetch();
              } else {
                setLauncherId(input);
              }
            }}
          >
            {farmerDifficultyQuery.isFetching ? <Loader /> : 'Check Difficulty'}
          </CheckButton>
        }
      />

      {farmerDifficultyQuery.data && farmerDifficultyQuery.isSuccess && (
        <p>
          Your current difficulty is: {farmerDifficultyQuery.data.difficulty}
        </p>
      )}
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

              <h4>Check current difficulty</h4>

              <LauncherIDInput />

              <Divider />

              <h4>Update difficulty</h4>

              <TextField
                name="launcherID"
                label="Launcher ID"
                desc=""
                placeholder=""
              />

              <Spacer size="sm" />

              <TextField
                name="newDifficulty"
                label="Difficulty"
                desc="Difficulty determines the frequency of partials. The lower the difficulty is, the more partials you will get. More partials will result in more precise stats."
                placeholder=""
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
