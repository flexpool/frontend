import { useField } from 'formik';
import { ButtonGroup } from '../common/ButtonGroup';

export const MainCoinButtonGroup = ({ name }: { name: string }) => {
  const [, { value: mainCoin }, { setValue: setMainCoin }] = useField(name);

  return (
    <>
      <ButtonGroup
        options={{
          etc: { label: 'Ethereum Classic + Zilliqa (ZMP)' },
          etc_compatible: {
            label: 'Ethereum Classic + Zilliqa (Compatible Mode)',
          },
        }}
        setSelectedOption={(s: string) => [setMainCoin(s)]}
        selectedOption={mainCoin}
      />
      {mainCoin === 'etc' && (
        <p
          style={{
            color: 'var(--error)',
          }}
        >
          The Zilliqa Mining Protocol (ZMP) is a revolutionary new way of mining
          Zilliqa. However, not all miners currently support it. For the best
          compatibility, we recommend using our <b>Compatible Mode</b> guide.
        </p>
      )}
    </>
  );
};

export default MainCoinButtonGroup;
