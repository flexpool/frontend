import React, { useState } from 'react';
import { isNumber } from 'lodash';
import { Form, Formik } from 'formik';
import { useTranslation, Trans } from 'next-i18next';
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
  const { t } = useTranslation('dashboard');
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
          <Trans
            ns="dashboard"
            i18nKey="settings.difficulty.pending_difficulty"
            values={{
              difficulty: farmerDifficultyQuery.data?.pendingDifficulty,
            }}
          />
        </InfoBox>
      )}

      <TextInput
        label="Launcher ID"
        desc={t('dashboard:settings.difficulty.launcher_id_desc')}
        errorMessage={
          farmerDifficultyQuery.error
            ? t('dashboard:settings.difficulty.launcher_id_error')
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
            {farmerDifficultyQuery.isFetching ? (
              <Loader />
            ) : (
              t('dashboard:settings.difficulty.check_difficulty_button')
            )}
          </CheckButton>
        }
      />

      {farmerDifficultyQuery.data && farmerDifficultyQuery.isSuccess && (
        <p>
          <Trans
            ns="dashboard"
            i18nKey="settings.difficulty.current_difficulty"
            values={{
              difficulty: farmerDifficultyQuery.data.difficulty,
            }}
          />
        </p>
      )}
    </>
  );
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const DifficultySettings = () => {
  const { mutateAsync, error } = useUpdateFarmerDifficulty();
  const { t } = useTranslation(['common', 'dashboard']);

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
              <h3>{t('dashboard:settings.difficulty.title')}</h3>

              <DifficultyWarning />
              {error && (
                <ScrollIntoView>
                  <InfoBox variant="error">{error.error}</InfoBox>
                </ScrollIntoView>
              )}

              <h4>{t('dashboard:settings.difficulty.check_difficulty')}</h4>

              <LauncherIDInput />

              <Divider />

              <h4>{t('dashboard:settings.difficulty.update_difficulty')}</h4>

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
                desc={t('dashboard:settings.difficulty.difficulty_desc')}
                placeholder=""
              />

              <Spacer size="sm" />

              <TextField
                name="loginLink"
                label="Login Link"
                desc={t('dashboard:settings.difficulty.login_link_desc')}
              />
              <Spacer size="sm" />

              {Number(values.newDifficulty) > 1 && <AcknowledgeCheckbox />}

              <Submit shape="block" disableWhenFormNotDirty={!isAcknowledged}>
                {t('dashboard:settings.difficulty.submit')}
              </Submit>
            </FieldGroup.V>
          </Form>
        );
      }}
    </Formik>
  );
};

export default DifficultySettings;
