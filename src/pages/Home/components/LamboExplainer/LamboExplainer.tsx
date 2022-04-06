import { useCounterTicker } from '@/rdx/localSettings/localSettings.hooks';

const LamboExplainer = () => {
  const counterTicker = useCounterTicker();

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
      <p style={{ color: 'var(--text-tertiary)' }}>
        Ł - LAMBO currency. mŁ - mLAMBO (microLAMBO), one 1000th of LAMBO.
      </p>
    </div>
  );
};

export default LamboExplainer;
