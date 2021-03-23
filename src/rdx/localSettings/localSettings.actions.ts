import { LocalSettingsState } from './localSettings.reducer';

export const localSettingsSet = (settings: Partial<LocalSettingsState>) => ({
  type: '@localSettings/SET',
  payload: settings,
});
