import React, { useState, useEffect } from 'react';
import { ButtonGroup } from 'src/pages/GetStarted/ChiaShared/ButtonGroup';
import qs from 'query-string';
import { useRouter } from 'next/router';
import { osList } from 'src/utils/oses';

function ButtonGroupOSSelector() {
  const router = useRouter();

  const [selectedOS, setSelectedOS] = useState('');

  const selectOS = React.useCallback(
    (s: string) => {
      const query = qs.stringify({
        ...qs.parse(window.location.search),
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
    },
    [router]
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const os = qs.parse(window.location.search).os?.toString();
      selectOS(os ? os : 'linux');
    }
  }, [selectOS]);

  return (
    <ButtonGroup
      options={osList}
      selectedOption={selectedOS}
      setSelectedOption={selectOS}
    />
  );
}

export default ButtonGroupOSSelector;
