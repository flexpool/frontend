import React from 'react';
import styled from 'styled-components';
import { Card } from 'src/components/layout/Card';
import Image from 'next/image';
import useTimeToLambo from '@/hooks/useTimeToLambo';

const Text = styled.span`
  font-weight: 500;
  font-size: 1.5rem;
  margin-left: 8px;
`;

const TimeToLambo = ({ coin, address }: { coin: string; address: string }) => {
  const time = useTimeToLambo({ coin, address });

  return (
    <Card style={{ display: 'flex', alignItems: 'center' }} paddingShort>
      <div style={{ marginLeft: '-12px', marginBottom: '-4px', flexShrink: 0 }}>
        <Image src="/lambo.png" width={60} height={37} alt="lambo" />
      </div>

      <Text>Your estimated time to Lambo is {time}.</Text>
    </Card>
  );
};

export default TimeToLambo;
