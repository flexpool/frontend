import { useField } from 'formik';
import { MineBTCBox } from './MineBTCBox';

type Props = {
  name?: string;
};

export const SetAutoSwapBTC = ({ name = 'btc' }: Props) => {
  const [field, , helpers] = useField(name);

  if (field.value !== undefined && typeof field.value !== 'boolean') {
    throw new Error('Field value needs to be Boolean');
  }

  return (
    <MineBTCBox
      checked={field.value}
      onClick={(checked) => {
        helpers.setValue(checked);
      }}
    />
  );
};
