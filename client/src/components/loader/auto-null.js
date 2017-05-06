/**
 * AutoNull.
 * Utility for returning null conditionally instead
 * of a component.
 */

import { branch, renderNothing } from 'recompose';

const autoNull = notReady => branch(
  notReady,
  renderNothing,
  self => self,
);

export default autoNull;
