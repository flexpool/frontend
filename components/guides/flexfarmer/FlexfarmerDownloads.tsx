import React, { useState, useEffect } from 'react';
import qs from 'query-string';
import { FlexfarmerDownloadLink } from './FlexfarmerDownloadLink';
import { osList } from 'src/utils/oses';
import styled from 'styled-components';

const downloads = {
  linux: [
    {
      arch: 'amd64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-linux-amd64-{{version}}.tar.gz',
      name: 'x86_64',
      bits: '64',
    },
    {
      arch: 'arm64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-linux-arm64-{{version}}.tar.gz',
      name: 'ARM x64 (RPi)',
      bits: '64',
    },
  ],
  windows: [
    {
      arch: 'amd64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-windows-amd64-{{version}}.zip',
      name: 'x64',
      bits: '64',
    },
  ],
};

const DownloadsList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FlexfarmerDownloads: React.FC<{
  version: string;
}> = ({ version }) => {
  let search;
  const [osState, setOSState] = useState(new Date());

  const osSelection = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      search = window.location.search;
    }
    const parsedSearch = qs.parse(search);
    return (parsedSearch.os as string) || 'linux';
  }, [osState]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', function (event) {
        setOSState(new Date());
      });
    }
  }, []);

  return downloads[osSelection] ? (
    <DownloadsList className="nostyled">
      {downloads[osSelection].map((item) => {
        return (
          <FlexfarmerDownloadLink
            os={osSelection}
            osName={osList[osSelection].label}
            info={item}
            link={item.link.replace('{{version}}', version)}
            version={version}
            key={item.link}
          />
        );
      })}
    </DownloadsList>
  ) : null;
};
