import React from 'react';
import { useDispatch } from 'react-redux';
import { localSettingsSet } from 'src/rdx/localSettings/localSettings.actions';
import { useReduxState } from 'src/rdx/useReduxState';

export const AppTheme = () => {
  const d = useDispatch();
  const localSettingsState = useReduxState('localSettings');
  // load system color scheme
  React.useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      d(localSettingsSet({ systemColorMode: 'dark' }));
    } else {
      d(localSettingsSet({ systemColorMode: 'light' }));
    }

    // system scheme watcher
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        const newColorScheme = e.matches ? 'dark' : 'light';
        d(localSettingsSet({ systemColorMode: newColorScheme }));
      });
  }, [d]);

  const colorMode =
    localSettingsState.colorMode !== 'system'
      ? localSettingsState.colorMode
      : localSettingsState.systemColorMode;

  // bu default, theme is light, we only add these items to make it dark
  if (colorMode === 'dark') {
    return (
      <style>{`body {
    --bg-primary: #151519;
    --bg-secondary: #2c2c31;
    --border-color: #333;
    --text-secondary: #ccc;
    --text-primary: #eee;
    }
    
    svg tspan {
      fill: var(--text-primary);
    }
    
    `}</style>
    );
  }

  return null;
};
