import { useTranslation } from 'next-i18next';
import { useCounterTicker } from '@/rdx/localSettings/localSettings.hooks';

const LamboExplainer = () => {
  const counterTicker = useCounterTicker();
  const { t } = useTranslation('home');

  if (counterTicker !== 'lambo') return null;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px',
      }}
    >
      <p style={{ color: 'var(--text-tertiary)' }}>{t('lambo_explainer')}</p>
    </div>
  );
};

export default LamboExplainer;
