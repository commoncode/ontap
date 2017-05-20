/**
 * BrewerySelect Store.
 * A store for the BrewerySelect view.
 */

import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';

class BrewerySelectStore extends ReduceStore {

  getInitialState() {
    return {
      fetching: false,
      error: null,
      models: [],
    };
  }

  // eslint-disable-next-line class-methods-use-this
  reduce(state, action) {
    const { type, data, error } = action;

    switch (type) {

      case 'REQUEST_FETCH_BREWERIES':
        return {
          fetching: true,
          error: null,
          models: [],
        };

      case 'RECEIVE_FETCH_BREWERIES':
        return {
          fetching: false,
          error: error || null,
          models: data || [],
        };

      default:
        return state;
    }
  }
}

export default new BrewerySelectStore(dispatcher);
