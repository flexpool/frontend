import React, { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { FaDownload } from 'react-icons/fa';
import { Button } from 'src/components/Button';
import { Img } from 'src/components/Img';
import { Card, CardBody } from 'src/components/layout/Card';
import { LinkOut } from 'src/components/LinkOut';
import { getOsLogoUrl } from 'src/utils/staticImage.utils';
import styled from 'styled-components';
import { GpuHardwareDetails } from '../mineableCoinList';
import { MinerCommand } from './MinerCommand';
import useCheckUserRegion from '@/hooks/useCheckUserRegion';
import { SectionWrapper } from '../common/SectionWrapper';

const MinerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 600px) {
    display: block;
  }
`;

const Fee: React.FC<{ fee: [number] | [number, number] }> = ({ fee }) => {
  if (fee.length === 1) {
    return <>{fee[0]}%</>;
  }
  if (fee.length === 2) {
    return (
      <>
        {fee[0]}-{fee[1]}%
      </>
    );
  }
  return null;
};

const PlatformSticker = styled.span<{ gpu: 'NVIDIA' | 'AMD' | string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  display: inline-block;
  margin-left: 0.5rem;
  font-family: 'Roboto Mono';
  font-size: 0.875rem;
  ${(p) => {
    switch (p.gpu) {
      case 'AMD':
        return `
          background: #EF0707;
          color: var(--text-on-bg);
      `;
      case 'NVIDIA':
        return `
          background: #7ab547;
          color: var(--text-on-bg);
      `;
    }
  }}
`;

const SoftwareWrapper = styled.div`
  & > * {
    margin-bottom: 1rem;
  }
`;

const OsLogo = styled(Img)`
  height: 30px;
`;
const OsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
  align-items: center;
  & > * {
    margin-left: 0.5rem;
  }
`;

export const MinerCommandSection = ({
  position,
  data,
  replaces,
  extra,
}: {
  position: number;
  data: GpuHardwareDetails[] | null;
  replaces: Record<string, string>;
  extra?: React.ReactNode;
}) => {
  const { t } = useTranslation('get-started');
  const isChinaRegion = useCheckUserRegion('zh');

  const minerMeta = useMemo(() => {
    if (data === null) return null;

    // Region specific commands
    if (isChinaRegion)
      return data.map((item) => {
        if (item.title === 'TeamRedMiner') {
          return {
            ...item,
            cmd: `${item.cmd} --dns_https=https://1.1.1.1/dns-query --dns_https_sni apple.com`,
          };
        }

        if (item.title === 'T-Rex Miner') {
          return {
            ...item,
            cmd: `${item.cmd} --dns-https-server 1.1.1.1 --no-sni`,
          };
        }

        return item;
      });

    return data;
  }, [isChinaRegion, data]);

  if (minerMeta === null) {
    return null;
  }

  return (
    <SectionWrapper position={position} title={t('detail.software.title')}>
      {extra}
      <SoftwareWrapper>
        {minerMeta.map((miner) => (
          <Card key={miner.key}>
            <CardBody>
              <MinerHeader>
                <div>
                  <h3>
                    {miner.title}{' '}
                    {miner.compatibleGpus.map((gpu) => (
                      <PlatformSticker key={gpu} gpu={gpu.toUpperCase()}>
                        {gpu}
                      </PlatformSticker>
                    ))}
                  </h3>
                  <p>{miner.description}</p>
                  <p>
                    <strong>{t('detail.software.fee')}: </strong>{' '}
                    <Fee fee={miner.fee} />{' '}
                  </p>
                </div>
                <OsContainer>
                  {miner.os.map((osItem) => (
                    <OsLogo
                      src={getOsLogoUrl(osItem)}
                      alt={`${osItem} logo`}
                      key={osItem}
                    />
                  ))}
                  <Button
                    shape="square"
                    variant="primary"
                    size="sm"
                    as={LinkOut}
                    href={miner.downloadLink}
                  >
                    <FaDownload />
                  </Button>
                </OsContainer>
              </MinerHeader>
            </CardBody>
            <MinerCommand command={miner.cmd} replaces={replaces} />
          </Card>
        ))}
      </SoftwareWrapper>
    </SectionWrapper>
  );
};
