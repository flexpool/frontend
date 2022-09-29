import { Card } from '@/components/layout/Card';
import styled from 'styled-components';
import { Trans, useTranslation } from 'next-i18next';
import { LinkOut } from '@/components/LinkOut';
import { Spacer } from '@/components/layout/Spacer';

const PayoutOnlyModeNote = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  padding: 12px 0 18px;

  p {
    margin-top: 2em;
  }
`;

export const PayoutsOnlyNote = () => {
  const { t } = useTranslation('dashboard');

  return (
    <>
      <Spacer />
      <Card
        padding
        style={{
          border: 'none',
        }}
      >
        <PayoutOnlyModeNote>
          <h2>{t('payout_only_mode_note.title')}</h2>
          <p>
            <Trans
              ns="dashboard"
              i18nKey="payout_only_mode_note.p1"
              components={{ supportlink: <LinkOut href="/support" /> }}
            />
          </p>
          <p>
            <Trans
              ns="dashboard"
              i18nKey="payout_only_mode_note.p2"
              components={{ supportlink: <LinkOut href="/support" /> }}
            />
          </p>
        </PayoutOnlyModeNote>
      </Card>
    </>
  );
};

export default PayoutsOnlyNote;
