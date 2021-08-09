import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import qs from 'query-string';
import { LinkOut } from 'src/components/LinkOut';
import { Button } from 'src/components/Button';
import { array } from '@amcharts/amcharts4/core';

function FlexfarmerDownloads() {
  const { t } = useTranslation('guide-flexfarmer');

  let search;
  const [osState, setOSState] = useState(new Date());

  const osSelection = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      search = window.location.search;
    }
    const parsedSearch = qs.parse(search);
    return parsedSearch.os || 'linux';
  }, [osState]);

  interface DownloadData {
    name: string;
    url: string;
  }

  const downloadData = osSelection
    ? (t(`select_os.operating_systems.${osSelection}.downloads`, {
        returnObjects: true,
      }) as Array<DownloadData>)
    : ([] as Array<DownloadData>);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', function (event) {
        setOSState(new Date());
      });
    }
  }, []);

  return (
    <>
      {downloadData && (
        <ul className="unstyled flex flex-wrap">
          {downloadData.map((item) => (
            <li key={item.name} className="mr-2">
              <Button
                variant="primary"
                // shape="block"
                as={LinkOut}
                href={item.url}
              >
                {t(`select_os.button_text`)} {item.name}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default FlexfarmerDownloads;
