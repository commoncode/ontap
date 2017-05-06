/**
 * AutoLoader.
 * Enhancer
 */

import { branch, renderComponent } from 'recompose';

import Loader from './';

const autoLoader = isLoading => branch(
  isLoading,
  renderComponent(Loader),
  self => self,
);

export default autoLoader;
