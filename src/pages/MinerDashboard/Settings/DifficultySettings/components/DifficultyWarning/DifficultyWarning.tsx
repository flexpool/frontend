import { useTranslation } from 'next-i18next';
import { InfoBox } from '@/components/InfoBox';

const DifficultyWarning = () => {
  const { t } = useTranslation(['common']);

  return (
    <InfoBox variant="warning">
      <h3>Important note</h3>
      <div>
        <p>
          The adjustable difficulty is a feature for advanced users only. We
          strongly recommend keeping 1 unless you have specific requirements.
          Please do not change the difficulty unless you know what you are
          doing.
        </p>
      </div>
    </InfoBox>
  );
};

export default DifficultyWarning;
