import type { PrismTheme } from 'prism-react-renderer';

var theme: PrismTheme = {
  plain: {
    color: 'var(--text-primary)',
    backgroundColor: 'var(--bg-secondary)',
  },
  styles: [
    {
      types: ['prolog'],
      style: {
        color: 'rgb(0, 0, 128)',
      },
    },
    {
      types: ['comment'],
      style: {
        color: 'var(--code-comment)',
      },
    },
    {
      types: ['builtin', 'changed', 'keyword', 'interpolation-punctuation'],
      style: {
        color: 'rgb(86, 156, 214)',
      },
    },
    {
      types: ['number', 'inserted'],
      style: {
        color: 'var(--code-number)',
      },
    },
    {
      types: ['constant'],
      style: {
        color: 'var(--code-constant)',
      },
    },
    {
      types: ['attr-name', 'variable'],
      style: {
        color: 'var(--text-tertiary)',
      },
    },
    {
      types: ['deleted', 'string', 'attr-value', 'template-punctuation'],
      style: {
        color: 'var(--code-string)',
      },
    },
    {
      types: ['selector'],
      style: {
        color: 'rgb(215, 186, 125)',
      },
    },
    {
      // Fix tag color
      types: ['tag', 'key'],
      style: {
        color: 'var(--code-key)',
      },
    },
    {
      // Fix tag color for HTML
      types: ['tag'],
      languages: ['markup'],
      style: {
        color: 'rgb(86, 156, 214)',
      },
    },
    {
      types: ['punctuation', 'operator'],
      style: {
        color: 'var(--text-secondary)',
      },
    },
    {
      // Fix punctuation color for HTML
      types: ['punctuation'],
      languages: ['markup'],
      style: {
        color: 'var(--text-secondary)',
      },
    },
    {
      types: ['function'],
      style: {
        color: 'rgb(220, 220, 170)',
      },
    },
    {
      types: ['class-name'],
      style: {
        color: 'rgb(78, 201, 176)',
      },
    },
    {
      types: ['char'],
      style: {
        color: 'rgb(209, 105, 105)',
      },
    },
    {
      types: ['boolean'],
      style: {
        color: 'var(--code-constant)',
      },
    },
  ],
};

export default theme;
