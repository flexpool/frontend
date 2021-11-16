import { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { InfoBox } from '@/components/InfoBox';

const PayoutWarning = () => {
  const { t } = useTranslation(['common']);

  const warningItems = useMemo(() => {
    const warnings = t('dashboard:settings.payout_warning', {
      returnObjects: true,
    });

    // t() could return translation key during unmount
    if (typeof warnings === 'string') return [];

    return warnings;
  }, [t]);

  return (
    <InfoBox variant="warning">
      <h3>Important note</h3>
      <div>
        {warningItems.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </InfoBox>
  );
};

export default PayoutWarning;
