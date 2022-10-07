import React from 'react';
import { Trans, useTranslation } from 'next-i18next';
import { Spacer } from 'src/components/layout/Spacer';
import { TerminalCommand } from './TerminalCommand';
import { LinkOut } from 'src/components/LinkOut';
import { SectionWrapper } from '../common';

type FarmerGuideProps = {
  position: number;
  primaryServer: string;
};

export const AlreadyFarmerGuide = (props: FarmerGuideProps) => {
  const { t } = useTranslation('get-started');
  const { primaryServer } = props;

  return (
    <SectionWrapper
      position={props.position}
      title={t('detail_xch.plotnft_join.title')}
    >
      <p>
        <Trans
          ns="get-started"
          i18nKey="detail_xch.plotnft_join.desc_one"
          components={{
            b: <b />,
          }}
        />
      </p>
      <Spacer />
      <p>{t('detail_xch.plotnft_join.assign_command')}</p>
      <TerminalCommand
        cmd={`chia plotnft join -i2 -u https://${primaryServer}`}
        output={
          <>
            {`Choose wallet key:
  1) 3118587270
  2) 2183884896
  3) 1324486352
  Enter a number to pick or q to quit: `}{' '}
            <b>1</b>
            {`

  Will join pool: https://${primaryServer} with Plot NFT 3118587270.
  Confirm [n]/y:`}{' '}
            <b>y</b>
          </>
        }
      />
      <p>
        <b>{t('detail.note') + ' '}</b>
        <Trans ns="get-started" i18nKey="detail_xch.plotnft_join.time_note" />
      </p>
    </SectionWrapper>
  );
};

export const NewFarmerGuide = (props: FarmerGuideProps) => {
  const { t } = useTranslation('get-started');
  const { primaryServer } = props;

  return (
    <SectionWrapper
      position={props.position}
      title={t('detail_xch.plotnft_create.title')}
    >
      <p>{t('detail_xch.plotnft_create.desc_one')}</p>
      <Spacer />
      <p>{t('detail_xch.plotnft_create.desc_two')}</p>
      <Spacer />
      <p>{t('detail_xch.plotnft_create.create_command')}</p>
      <TerminalCommand
        cmd={`chia plotnft create -s pool -u https://${primaryServer}`}
        output={
          <>
            {`Choose wallet key:
  1) 3118587270
  2) 2183884896
  3) 1324486352
  Enter a number to pick or q to quit: `}{' '}
            <b>1</b>
            {`

  Will create a plot NFT and join pool: https://${primaryServer}.
  Confirm [n]/y:`}{' '}
            <b>y</b>
          </>
        }
      />
      <p>
        <b>{t('detail.note') + ' '}</b>
        <Trans
          ns="get-started"
          i18nKey="detail_xch.plotnft_create.mojo_note"
          components={{
            chiafaucet: <LinkOut href="https://faucet.chia.net" />,
          }}
        />
      </p>
    </SectionWrapper>
  );
};
