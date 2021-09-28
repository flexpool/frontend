import 'styled-components';
import { ThemedStyledComponentsModule } from 'styled-components';
import { MainTheme, UIVariant as TUIV } from 'src/App/styledTheme';

declare module 'styled-components' {
  // export interface DefaultTheme extends MainTheme {}
  // const ModuleInterface: ThemedStyledComponentsModule<MainTheme>;
  // export const createGlobalStyle: typeof ModuleInterface.createGlobalStyle;
  // // export const css: typeof ModuleInterface.css;
  // export const keyframes: typeof ModuleInterface.keyframes;
  // export const isStyledComponent: typeof ModuleInterface.isStyledComponent;
  // export const ServerStyleSheet: typeof ModuleInterface.ServerStyleSheet;
  // export const StyleSheetManager: typeof ModuleInterface.StyleSheetManager;
  // export const ThemeConsumer: typeof ModuleInterface.ThemeConsumer;
  // export const ThemeContext: typeof ModuleInterface.ThemeContext;
  // export const ThemeProvider: typeof ModuleInterface.ThemeProvider;
  // export const withTheme: typeof ModuleInterface.withTheme;
  export type UIVariant = TUIV;
  // export default ModuleInterface.default;
}

declare module '*.jpg';
