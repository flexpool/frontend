import { createGlobalStyle } from 'styled-components';

const colors = {
  success: '#1BBC9B',
  danger: '#E64C66',
  primary: '#F4450D',
};
export const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(13deg, #f9d4ff 14%,#c7ceff 64%);
    border-radius: 10px;
    box-shadow: inset 7px 7px 12px #e8e8e8;
    transition: .2s all;
  }
  ::-webkit-scrollbar-thumb:hover{
  background: linear-gradient(13deg, #c7ceff 14%,#f9d4ff 64%);  
  }
  ::-webkit-scrollbar-track{
    background: transparent;
  }

  html {
    font-size: 16px;

    --primary: ${colors.primary};
    --danger: ${colors.danger};
    --success: ${colors.success};
  }

  

  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
    background: white;
    color: #6b6c6f;
  }

  /** font family **/
  body,
  input,
  button,
  textarea {
    font-family: 'Quicksand', sans-serif;
    letter-spacing: .2px;
    font-weight: 500;
  }

  input, textarea {
    font-weight: 600;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }

  *,
  ::after,
  ::before {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    line-height: 1.35;
  }

  h1,h2,h3,h4,h5,h6 {
    font-family: 'Overpass', sans-serif;
    color: #111432;
    &+* {
      margin-top: 1rem;
    }
  }

  a {
    transition: 0.2s all;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.6rem;
  }

  h3 {
    font-size: 1.125rem;
  }

  p {
    font-size: 1rem;
    max-width: 760px;
    line-height: 1.4rem;

    & + * {
      margin-top: 0.5rem;
    }
  }

  * + h1,
  * + h2,
  * + h3,
  * + h4,
  * + h5 {
    margin-top: 1.5em;
  }

  * + p {
    margin-top: .5rem;
  }


  /**MUI  */
  body {
    .MuiSvgIcon-colorPrimary {
      color: var(--primary);
    }
  }
`;

const boxShadow = `box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);`;

export const mainTheme = {
  scrollAttrs: `
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  `,
  navigation: {
    width: '240px',
  },
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    onBg: 'var(--text-on-bg)',
  },
  color: {
    success: 'var(--success)',
    danger: 'var(--secondary)',
    primary: 'var(--primary)',
    onBg: '#fff',
  },
  border: {
    default: '1px solid var(--border-color)',
  },
  boxShadow: `box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);`,
};

export type MainTheme = typeof mainTheme;
export type UIVariant = keyof typeof mainTheme.color | undefined;
