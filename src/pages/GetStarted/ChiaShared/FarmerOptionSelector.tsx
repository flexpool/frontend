import { useTranslation } from 'next-i18next';
import { ButtonGroup } from './ButtonGroup';

type FarmerOptionProps = {
  selectedFarmerOption: string;
  setSelectedFarmerOption: (s: string) => void;
};

export const FarmerOptionSelector = (props: FarmerOptionProps) => {
  const { t } = useTranslation('get-started');

  const { selectedFarmerOption, setSelectedFarmerOption } = props;

  return (
    <ButtonGroup
      options={{
        'new-farmer': t('detail_xch.new_farmer'),
        'already-farmer': t('detail_xch.already_farmer'),
      }}
      setSelectedOption={(s: string) => {
        setSelectedFarmerOption(s);
      }}
      selectedOption={selectedFarmerOption}
    />
  );
};
