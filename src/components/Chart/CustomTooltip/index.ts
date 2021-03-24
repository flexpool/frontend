import { defaultTooltip } from './renderers/default';

/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

export default function createCustomTooltip(
  tooltipEl: HTMLElement | null,
  tooltip: any,
  formatter: any,
  renderer = defaultTooltip
) {
  if (!tooltipEl) {
    return;
  }
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = '0'; // eslint-disable-line
    return;
  }
  const contentRoot = tooltipEl.querySelector('.tooltip__content');
  if (contentRoot) {
    contentRoot.className = `tooltip__content ${tooltip.yAlign} ${tooltip.xAlign}`;
  }

  // Set Text
  if (tooltip.body) {
    const items = tooltip.body
      .map((i: any) => i.lines[0].split(':').map((text: any) => text.trim()))
      .map((i: any, index: any) => ({
        color: tooltip.labelColors[index].backgroundColor,
        label: i[0],
        value: i[1],
      }));

    if (contentRoot) {
      contentRoot.innerHTML = renderer(
        {
          items,
          title: tooltip.title[0],
        },
        formatter
      );
    }
  }

  // Display, position, and set styles for font
  tooltipEl.style.opacity = '1';
  tooltipEl.style.left = `${tooltip.caretX}px`;
  tooltipEl.style.top = `${tooltip.caretY}px`;
  tooltipEl.style.fontSize = tooltip.fontSize;
  tooltipEl.style.fontStyle = tooltip._fontStyle;
}
