import { Spacer } from '@/components/layout/Spacer';
import { DashboardLink, SectionWrapper } from '../common';
import { useTranslation } from 'next-i18next';
import { MineableCoin } from '../mineableCoinList';
import styled from 'styled-components';

const StackBox = styled.div`
  display: flex;
  align-items: center;

  * + * {
    margin-left: 16px;
  }
`;

export const ViewDashboard = ({
  position,
  primary,
  dual,
}: {
  position: number;
  primary: { coin: MineableCoin; address: string };
  dual: { coin: MineableCoin; address: string };
}) => {
  const { t } = useTranslation('get-started');

  return (
    <SectionWrapper position={position} title={t('detail.view.title')}>
      <p>{t('detail.view.description')}</p>
      <Spacer />
      <StackBox>
        <DashboardLink coin={primary.coin} address={primary.address} />
        <DashboardLink coin={dual.coin} address={dual.address} />
      </StackBox>
    </SectionWrapper>
  );
};

export default ViewDashboard;
