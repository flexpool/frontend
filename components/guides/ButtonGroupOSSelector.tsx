import React, { useState, useEffect } from 'react';
import { ButtonGroup } from 'src/pages/GetStarted/ChiaShared/ButtonGroup';
import qs from 'query-string';
import { useRouter } from 'next/router';

function ButtonGroupOSSelector() {
  const router = useRouter();
  const osList = {
    linux: 'Linux',
    windows: 'Windows',
    macOS: 'macOS',
  };
  const [selectedOS, setSelectedOS] = useState('');
  let search;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      search = window.location.search;
      const os = qs.parse(search).os?.toString();
      selectOS(os ? os : 'linux');
    }
  }, []);

  const selectOS = (s: string) => {
    if (typeof window !== 'undefined') {
      search = window.location.search;
    }

    const query = qs.stringify({
      ...qs.parse(search),
      os: s,
    });

    const newUrl = `${router.asPath.split('?')[0]}/?${query}`;

    window.history.pushState(
      { ...window.history.state, as: newUrl, url: newUrl },
      '',
      newUrl
    );
    let queryStringChange = new Event('popstate');
    setSelectedOS(s);
    window.dispatchEvent(queryStringChange);
  };

  return (
    <ButtonGroup
      options={osList}
      selectedOption={selectedOS}
      setSelectedOption={selectOS}
    />
  );
}

export default ButtonGroupOSSelector;
