import { useTranslation } from 'next-i18next';
import { InfoBox } from '@/components/InfoBox';

const DifficultyWarning = () => {
  const { t } = useTranslation(['common']);

  return (
    <InfoBox variant="warning">
      <h3>{t('dashboard:settings.important_note')}</h3>
      <div>
        <p>{t('dashboard:settings.difficulty.warning')}</p>
      </div>
    </InfoBox>
  );
};

export default DifficultyWarning;
