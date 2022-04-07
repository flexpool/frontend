import React from 'react';
import styled from 'styled-components';
import { Card } from 'src/components/layout/Card';
import Image from 'next/image';
import useTimeToLambo from '@/hooks/useTimeToLambo';
import { useCounterTicker } from '@/rdx/localSettings/localSettings.hooks';
import { useTranslation } from 'next-i18next';
import useIsMounted from '@/hooks/useIsMounted';

const Text = styled.span`
  font-weight: 500;
  font-size: 1.5rem;
  margin-left: 8px;
`;

const TimeToLambo = ({ coin, address }: { coin: string; address: string }) => {
  const { t } = useTranslation('dashboard');
  const time = useTimeToLambo({ coin, address });
  const counterTicker = useCounterTicker();
  const isMounted = useIsMounted();

  if (!isMounted || counterTicker !== 'lambo') return null;

  return (
    <Card style={{ display: 'flex', alignItems: 'center' }} paddingShort>
      <div
        style={{
          marginLeft: '-12px',
          marginBottom: '-4px',
          flexShrink: 0,
          width: '60px',
          height: '37px',
        }}
      >
        <Image src="/images/lambo.png" width={120} height={74} alt="lambo" />
      </div>

      <Text>
        {t('header.time_to_lambo', {
          time,
        })}
      </Text>
    </Card>
  );
};

export default TimeToLambo;
