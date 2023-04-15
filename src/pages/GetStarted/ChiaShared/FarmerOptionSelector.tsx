import { useTranslation } from 'next-i18next';
import { ButtonGroupField } from '../common/ButtonGroup';

type FarmerOptionProps = {
  name: string;
};

export const FarmerOptionSelector = ({ name }: FarmerOptionProps) => {
  const { t } = useTranslation('get-started');

  return (
    <ButtonGroupField
      options={[
        { key: 'new-farmer', label: t('detail_xch.new_farmer') },
        { key: 'already-farmer', label: t('detail_xch.already_farmer') },
      ]}
      name={name}
    />
  );
};
