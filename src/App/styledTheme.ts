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
