import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { localStorage } from 'src/utils/localStorage';
import qs from 'query-string';
export const usePwaInit = () => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();

  React.useEffect(() => {
    const saveInstalledPathFrom = () => {
      localStorage('installedFrom').set(pathname);
    };

    window.addEventListener('appinstalled', saveInstalledPathFrom);

    return () => {
      window.removeEventListener('appinstalled', saveInstalledPathFrom);
    };
  }, [pathname]);

  React.useEffect(() => {
    const { pwa_init } = qs.parse(search);

    /**
     * in manifest, start url is ?pwa_init=true
     * this way we know that the app was opened as an installed app
     */
    if (pwa_init === 'true') {
      const redirUrl = localStorage<string>('installedFrom').get();
      if (redirUrl) {
        replace(redirUrl);
      }
    }
  }, [search, replace]);
};
