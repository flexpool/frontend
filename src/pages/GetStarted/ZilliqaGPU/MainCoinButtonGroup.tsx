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
          etc: { label: 'ETC + ZIL (ZMP)' },
          etc_compatible: {
            label: `ETC + ZIL (${t('detail_zil.compatible_mode')})`,
          },
        }}
        setSelectedOption={(s: string) => [setMainCoin(s)]}
        selectedOption={mainCoin}
      />
      {mainCoin === 'etc_compatible' && (
        <p
          style={{
            color: 'var(--error)',
          }}
        >
          {t('detail_zil.switch_zmp')}
        </p>
      )}
    </>
  );
};

export default MainCoinButtonGroup;
