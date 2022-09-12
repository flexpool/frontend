import { LinkOut } from '@/components/LinkOut';
import { Button } from '@/components/Button';
import { Spacer } from '@/components/layout/Spacer';
import SectionWrapper from '../common/SectionWrapper';
import { useTranslation, UseTranslation } from 'next-i18next';
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
  primary,
  dual,
}: {
  primary: { coin: MineableCoin; address: string };
  dual: { coin: MineableCoin; address: string };
}) => {
  const { t } = useTranslation('get-started');

  return (
    <SectionWrapper position={6} title={t('detail.view.title')}>
      <p>{t('detail.view.description')}</p>
      <Spacer />
      <StackBox>
        <Button
          variant="primary"
          as={LinkOut}
          href={`/miner/${primary.coin.ticker}/${primary.address}`}
        >
          Open {primary.coin.name} Dashboard
        </Button>
        <Button
          variant="primary"
          as={LinkOut}
          href={`/miner/${dual.coin.ticker}/${dual.address}`}
        >
          Open {dual.coin.name} Dashboard
        </Button>
      </StackBox>
    </SectionWrapper>
  );
};

export default ViewDashboard;
