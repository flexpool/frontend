import { ButtonGroupField } from './ButtonGroup';
import { SectionWrapper } from './SectionWrapper';
import { useTranslation } from 'next-i18next';

type Props = {
  options: { key: string; label: string }[];
  name: string;
};

export const ConfigOptions = ({ options, name }: Props) => {
  const { t } = useTranslation('get-started');

  return (
    <SectionWrapper position={1} title={t('detail.select_dual_mining')}>
      <ButtonGroupField name={name} options={options}></ButtonGroupField>
    </SectionWrapper>
  );
};
