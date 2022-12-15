import { useField } from 'formik';
import { ButtonGroup } from '../common/ButtonGroup';
import { useTranslation } from 'next-i18next';

export const MainCoinButtonGroup = ({ name }: { name: string }) => {
  const [, { value: mainCoin }, { setValue: setMainCoin }] = useField(name);
  const { t } = useTranslation('get-started');

  return (
    <>
      <ButtonGroup
        options={{
          etc: { label: 'Ethereum Classic + Zilliqa (ZMP)' },
          etc_compatible: {
            label: `Ethereum Classic + Zilliqa (${t(
              'detail_zil.compatible_mode'
            )})`,
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
          {t('detail_zil.zmp_explain')}
        </p>
      )}
    </>
  );
};

export default MainCoinButtonGroup;
