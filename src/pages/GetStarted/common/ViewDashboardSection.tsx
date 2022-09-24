import React from 'react';
import SectionWrapper from './SectionWrapper';
import { useTranslation } from 'next-i18next';
import { Spacer } from '@/components/layout/Spacer';
import DashboardLink from './DashboardLink';

export const ViewDashboardSection = ({
  coin,
  address,
}: {
  coin: { name: string; ticker: string };
  address: string;
}) => {
  const { t } = useTranslation('get-started');
  return (
    <SectionWrapper title={t('detail.view.title')}>
      <p>{t('detail.view.description')}</p>
      <Spacer />
      <p>
        <DashboardLink coin={coin} address={address} />
      </p>
    </SectionWrapper>
  );
};

export default ViewDashboardSection;
