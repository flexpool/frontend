import { TextField } from 'src/components/Form/TextInput';
import { MineableCoin } from '../mineableCoinList';
import { useTranslation } from 'next-i18next';

export const WalletTextField = ({
  name,
  data: { walletAddressExample, validator },
  label,
  isBTC,
}: {
  name: string;
  data: MineableCoin;
  label?: string | React.ReactNode;
  isBTC?: boolean;
}) => {
  const { t } = useTranslation('get-started');

  return (
    <TextField
      validate={(value) => {
        if (value === '' || typeof value === 'undefined') return undefined;

        value = isBTC ? 'btc:' + value : value;
        const r = validator(value);
        if (typeof r === 'string' && r !== '') return undefined;
        return t('detail.wallet.invalid_address') as string;
      }}
      name={name}
      autoComplete="off"
      spellCheck="false"
      label={label ?? t('detail.wallet.wallet_address')}
      placeholder={
        isBTC
          ? 'bc1q5zx6dqklmnjq9gffv70fsrz7uaulmr65vyf0hj'
          : walletAddressExample
      }
    />
  );
};

export default WalletTextField;
