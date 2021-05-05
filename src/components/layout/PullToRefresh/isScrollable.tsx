export const DIRECTION = Object.freeze({
  up: -0b01,
  down: 0b01,
});

function isOverflowScrollable(element: Element) {
  const overflowType = getComputedStyle(element).overflowY;
  if (element === document.scrollingElement && overflowType === 'visible') {
    return true;
  }

  if (overflowType !== 'scroll' && overflowType !== 'auto') {
    return false;
  }

  return true;
}

/**
 * Returns whether a given element is scrollable in a given direction.
 * This only checks this element, not any of its ancestors.
 *
 * @param {!Element} element The DOM element to check
 * @param {!number} direction The direction (see {@link DIRECTION})
 * @returns {!boolean} Whether the element is scrollable
 */
function isScrollable(element: Element, direction: number) {
  if (!isOverflowScrollable(element)) {
    return false;
  }

  if (direction === DIRECTION.down) {
    const bottomScroll = element.scrollTop + element.clientHeight;

    return bottomScroll < element.scrollHeight;
  }

  if (direction === DIRECTION.up) {
    return element.scrollTop > 0;
  }

  throw new Error('unsupported direction');
}

/**
 * Returns whether a given element or any of its ancestors (up to rootElement) is scrollable in a given direction.
 *
 * @param {!Element} element The leaf of the DOM tree to check
 * @param {!number} dir The direction (see {@link DIRECTION})
 * @returns {!boolean} Whether the element or one of its ancestors is scrollable.
 */
export function isTreeScrollable(element: Element, dir: number): boolean {
  if (isScrollable(element, dir)) {
    return true;
  }

  // if a body is overflow: hidden, scrolling will be disabled even though scrollingElement will report that it is not.
  if (
    element === document.body &&
    getComputedStyle(document.body).overflowY === 'hidden'
  ) {
    return false;
  }

  if (element.parentElement == null) {
    return false;
  }

  return isTreeScrollable(element.parentElement, dir);
}
