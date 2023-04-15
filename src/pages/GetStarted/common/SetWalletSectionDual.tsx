import React from 'react';
import { Spacer } from 'src/components/layout/Spacer';
import { LinkOut } from 'src/components/LinkOut';
import { MineableCoin, mineableCoins } from '../mineableCoinList';
import { Trans, useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { SectionWrapper } from '../common/SectionWrapper';
import { WalletTextField } from '../common/WalletTextField';
import Image from 'next/image';
import { getCoinIconUrl } from '@/utils/staticImage.utils';

type SetWalletSectionDualProps = {
  position: number;
  coinMain: MineableCoin;
  coinDual: MineableCoin;
  nameMain: string;
  nameDual: string;
  desc?: React.ReactNode;
};

const TextFieldLayout = styled.div`
  display: flex;
  max-width: 1000px;
  line-height: 1.4;
  flex-wrap: wrap;
  gap: 16px;

  & > div {
    min-width: 400px;
    flex: 1;
  }
`;

const WalletLabelWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const WalletLabel = ({ data }: { data: MineableCoin }) => {
  return (
    <WalletLabelWrapper>
      <Image
        alt={`${data?.name} icon`}
        width={20}
        height={20}
        src={getCoinIconUrl(data?.ticker, 'small')}
      />
      <div style={{ marginLeft: 4 }}>{data.ticker} WALLET ADDRESS</div>
    </WalletLabelWrapper>
  );
};

export const SetWalletSectionDual = ({
  coinMain,
  coinDual,
  nameMain,
  nameDual,
  position,
  desc,
}: SetWalletSectionDualProps) => {
  const { t } = useTranslation('get-started');

  return (
    <SectionWrapper position={position} title={t('detail.wallet.title')}>
      {desc ? (
        desc
      ) : (
        <>
          <p>
            <Trans
              ns="get-started"
              i18nKey="detail.wallet.desc_one"
              components={{
                binance: (
                  <LinkOut href="https://www.binance.com/en/register?ref=B2675KF5" />
                ),
                coinbase: <LinkOut href="https://www.coinbase.com" />,
              }}
            />
          </p>
          <p>
            <Trans
              ns="get-started"
              i18nKey="detail.wallet.desc_two"
              components={{
                ledger: <LinkOut href="https://www.ledger.com/" />,
                trezor: <LinkOut href="https://trezor.io/" />,
                strong: <strong />,
              }}
            />
          </p>
        </>
      )}

      <Spacer />
      <TextFieldLayout>
        <WalletTextField
          name={nameDual}
          data={coinDual}
          label={<WalletLabel data={coinDual} />}
        />
        <WalletTextField
          name={nameMain}
          data={coinMain}
          label={<WalletLabel data={coinMain} />}
        />
      </TextFieldLayout>
    </SectionWrapper>
  );
};

export default SetWalletSectionDual;
