import { useTranslation } from 'next-i18next';
import { ButtonGroupField } from '../common/ButtonGroup';

type FarmerOptionProps = {
  name: string;
};

export const FarmerOptionSelector = ({ name }: FarmerOptionProps) => {
  const { t } = useTranslation('get-started');

  return (
    <ButtonGroupField
      options={{
        'new-farmer': { label: t('detail_xch.new_farmer') },
        'already-farmer': { label: t('detail_xch.already_farmer') },
      }}
      name={name}
    />
  );
};
