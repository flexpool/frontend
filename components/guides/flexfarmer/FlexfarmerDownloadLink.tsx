import React from 'react';
import { useRouter } from 'next/router';
import { Button } from 'src/components/Button';
import { useAsyncState } from 'src/hooks/useAsyncState';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import { Img } from 'src/components/Img';

const FlexfarmerDownloadLinkWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
  padding: 20px 0px;
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr 1fr;
  }
`;

const FlexfarmerDownloadButton = styled(Button)`
  background: var(--bg-secondary);
  border-radius: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-primary);

  img {
    height: 1.5em;
    width: 1.5em;
    margin-right: 1em;
  }
`;

const FlexfarmerDownloadInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

interface DownloadInfo {
  arch: string;
  link: string;
  name: string;
  bits: string;
}

export const FlexfarmerDownloadLink: React.FC<{
  os: string;
  osName: string;
  info: DownloadInfo;
  link: string;
  version: string;
}> = ({ os, osName, info, version, link }) => {
  const checksumState = useAsyncState<Response>();
  const [checksum, setChecksum] = React.useState('N/A');
  const router = useRouter();
  const { t } = useTranslation('guide-flexfarmer');

  React.useEffect(() => {
    if (version === null) return;
    checksumState.start(fetch(link + '.sha256')).then((res) => {
      res.text().then((text) => {
        setChecksum(text);
      });
      return res;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, link]);

  return (
    <FlexfarmerDownloadLinkWrapper>
      <FlexfarmerDownloadButton
        onClick={() => {
          router.push(link);
        }}
        title={`${t('download')} FlexFarmer ${version} (${osName} ${info.name})`}
      >
        <Img
          src={`https://static.flexpool.io/assets/os/${os}.png`}
          alt={`${osName} logo`}
        />
        {osName} {info.name}
      </FlexfarmerDownloadButton>
      <FlexfarmerDownloadInfoBox>
        <div>
          Version {version} <span style={{ color: 'var(--text-tertiary)' }}>|</span> {os}/
          {info.arch}
        </div>
      </FlexfarmerDownloadInfoBox>
      <FlexfarmerDownloadInfoBox>
        <div>
          SHA-256 Checksum: <span style={{ color: 'var(--primary)' }}>{checksum}</span>
        </div>
      </FlexfarmerDownloadInfoBox>
    </FlexfarmerDownloadLinkWrapper>
  );
};
