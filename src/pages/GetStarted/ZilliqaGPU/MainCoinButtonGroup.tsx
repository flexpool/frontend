import { useField } from 'formik';
import { ButtonGroup } from '../common/ButtonGroup';

export const MainCoinButtonGroup = ({ name }: { name: string }) => {
  const [, { value: mainCoin }, { setValue: setMainCoin }] = useField(name);

  return (
    <ButtonGroup
      options={{
        etc: { label: 'Ethereum Classic + Zilliqa' },
      }}
      setSelectedOption={(s: string) => [setMainCoin(s)]}
      selectedOption={mainCoin}
    />
  );
};

export default MainCoinButtonGroup;
