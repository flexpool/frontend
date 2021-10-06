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
      arch: '386',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-linux-386-{{version}}.tar.gz',
      name: 'x86_32',
      bits: '32',
    },
    {
      arch: 'arm64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-linux-arm64-{{version}}.tar.gz',
      name: 'ARM x64 (RPi)',
      bits: '64',
    },
    {
      arch: 'arm',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-linux-arm-{{version}}.tar.gz',
      name: 'ARM x32 (RPi)',
      bits: '32',
    },
  ],
  windows: [
    {
      arch: 'amd64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-windows-amd64-{{version}}.zip',
      name: 'x64',
      bits: '64',
    },
    {
      arch: '386',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-windows-386-{{version}}.zip',
      name: 'x32',
      bits: '32',
    },
  ],
  darwin: [
    {
      arch: 'amd64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-darwin-amd64-{{version}}.tar.gz',
      name: 'Intel',
      bits: '64',
    },
    {
      arch: 'arm64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-darwin-arm64-{{version}}.tar.gz',
      name: 'Apple Silicon',
      bits: '64',
    },
  ],
  others: [
    {
      arch: 'mips',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-linux-mips-{{version}}.tar.gz',
      name: 'Linux mips',
      bits: '32',
    },
    {
      arch: 'mipsle',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-linux-mipsle-{{version}}.tar.gz',
      name: 'Linux mipsle',
      bits: '32',
    },
    {
      arch: 'mips64le',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-linux-mips64le-{{version}}.tar.gz',
      name: 'Linux mips64le',
      bits: '64',
    },
    {
      arch: 'ppc64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-linux-ppc64-{{version}}.tar.gz',
      name: 'Linux ppc64',
      bits: '64',
    },
    {
      arch: 'ppc64le',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-linux-ppc64le-{{version}}.tar.gz',
      name: 'Linux ppc64le',
      bits: '64',
    },
    {
      arch: 'riscv64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-linux-riscv64-{{version}}.tar.gz',
      name: 'Linux riscv64',
      bits: '64',
    },
    {
      arch: 's390x',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-linux-s390x-{{version}}.tar.gz',
      name: 'Linux s390x',
      bits: '32',
    },
    {
      arch: 'arm',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-windows-arm-{{version}}.zip',
      name: 'Windows ARM (32-bit)',
      bits: '32',
    },
    {
      arch: 'amd64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-freebsd-amd64-{{version}}.tar.gz',
      name: 'FreeBSD amd64',
      bits: '64',
    },
    {
      arch: '386',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-freebsd-386-{{version}}.tar.gz',
      name: 'FreeBSD 386',
      bits: '32',
    },
    {
      arch: 'arm64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-freebsd-arm64-{{version}}.tar.gz',
      name: 'FreeBSD arm64',
      bits: '64',
    },
    {
      arch: 'arm',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-freebsd-arm-{{version}}.tar.gz',
      name: 'FreeBSD arm (32-bit)',
      bits: '32',
    },
    {
      arch: 'amd64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-openbsd-amd64-{{version}}.tar.gz',
      name: 'OpenBSD amd64',
      bits: '64',
    },
    {
      arch: '386',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-openbsd-386-{{version}}.tar.gz',
      name: 'OpenBSD 386',
      bits: '32',
    },
    {
      arch: 'arm64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-openbsd-arm64-{{version}}.tar.gz',
      name: 'OpenBSD arm64',
      bits: '64',
    },
    {
      arch: 'arm',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-openbsd-arm-{{version}}.tar.gz',
      name: 'OpenBSD arm (32-bit)',
      bits: '32',
    },
    {
      arch: 'mips64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-openbsd-mips64-{{version}}.tar.gz',
      name: 'OpenBSD mips64',
      bits: '64',
    },
    {
      arch: 'amd64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-netbsd-amd64-{{version}}.tar.gz',
      name: 'NetBSD amd64',
      bits: '64',
    },
    {
      arch: '386',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-netbsd-386-{{version}}.tar.gz',
      name: 'NetBSD 386',
      bits: '32',
    },
    {
      arch: 'arm64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-netbsd-arm64-{{version}}.tar.gz',
      name: 'NetBSD arm64',
      bits: '64',
    },
    {
      arch: 'arm',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-netbsd-arm-{{version}}.tar.gz',
      name: 'NetBSD arm (32-bit)',
      bits: '32',
    },
    {
      arch: 'amd64',
      link: 'https://static.flexpool.io/dl/flexfarmer/flexfarmer-solaris-amd64-{{version}}.tar.gz',
      name: 'Solaris amd64',
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
    return parsedSearch.os as string;
  }, [osState]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', function (event) {
        setOSState(new Date());
      });
    }
  }, []);

  return (
    <>
      {downloads[osSelection] ? (
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
      ) : null}
      Docker image is available at{' '}
      <a href="https://hub.docker.com/r/flexpool/flexfarmer" target="__blank">
        flexpool/flexfarmer
      </a>
      .
    </>
  );
};
