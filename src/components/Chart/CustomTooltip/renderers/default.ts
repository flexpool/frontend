export const defaultTooltip = ({ items, title }: any, formatter: any) => {
  const innerContent = items
    .map((i: any) => {
      const value = parseFloat(i.value);
      return `
        <li>
          <span class="box" style="background-color: ${i.color}"></span>
          ${i.label}
          <b ${value === 0 ? 'class="empty"' : null}>${formatter(value)}</b>
        </li>
      `;
    })
    .join('');

  if (innerContent) {
    return `<span class="title">${title}</span> <ul>${innerContent}</ul>`;
  }

  return '';
};
