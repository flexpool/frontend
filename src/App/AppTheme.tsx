import React from 'react';
import { useDispatch } from 'react-redux';
import { localSettingsSet } from 'src/rdx/localSettings/localSettings.actions';
import { useAppTheme } from 'src/rdx/localSettings/localSettings.hooks';

export const AppTheme = () => {
  const d = useDispatch();
  // load system color scheme
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        d(localSettingsSet({ systemColorMode: 'dark' }));
      } else {
        d(localSettingsSet({ systemColorMode: 'light' }));
      }

      // system scheme watcher
      try {
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', (e) => {
            const newColorScheme = e.matches ? 'dark' : 'light';
            d(localSettingsSet({ systemColorMode: newColorScheme }));
          });
      } catch {
        //
      }
    }
  }, [d]);

  const colorMode = useAppTheme();

  // bu default, theme is light, we only add these items to make it dark
  if (colorMode === 'dark') {
    return (
      <style>{`body {
    --bg-primary: #151519;
    --bg-secondary: #1c1c1f;
    --border-color: #333;
    --text-secondary: #ccc;
    --text-primary: #eee;
    --overlay: rgba(0, 0, 0, 0.5)
    }
    
    svg tspan {
      fill: var(--text-primary);
    }
    
    `}</style>
    );
  }

  return null;
};
