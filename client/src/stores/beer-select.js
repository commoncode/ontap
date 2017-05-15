/**
 * BeerSelect Store.
 * A store for the BeerSelect view.
 */

import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';

class BeerSelectStore extends ReduceStore {

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

      case 'REQUEST_FETCH_BEERS':
        return {
          fetching: true,
          error: null,
          models: [],
        };

      case 'RECEIVE_FETCH_BEERS':
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

export default new BeerSelectStore(dispatcher);
