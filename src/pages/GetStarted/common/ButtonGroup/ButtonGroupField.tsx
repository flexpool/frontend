import { ButtonGroup } from './ButtonGroup';
import { useField } from 'formik';

type ButtonGroupFieldProps = {
  options: { [key: string]: { label: string } };
  name: string;
};

export const ButtonGroupField = ({ options, name }: ButtonGroupFieldProps) => {
  const [, { value }, { setValue }] = useField(name);

  return (
    <ButtonGroup
      options={options}
      setSelectedOption={(s: string) => [setValue(s)]}
      selectedOption={value}
    />
  );
};

export default ButtonGroupField;
