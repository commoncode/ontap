/**
 * BeerSelect Store.
 * A store for the BeerSelect view.
 */

import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';

class BeerSelectStore extends ReduceStore {

  getInitialState() {
    return {
      beers: [],
      fetching: false,
      fetched: false,
      error: null,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  reduce(state, action) {
    const { type, data, error } = action;

    switch (type) {

      case 'REQUEST_FETCH_BEERS':
        return {
          fetching: true,
          fetched: false,
          error: null,
          beers: [],
        };

      case 'RECEIVE_FETCH_BEERS':
        return {
          fetching: false,
          fetched: true,
          error: error || null,
          beers: data || [],
        };

      default:
        return state;
    }
  }
}

export default new BeerSelectStore(dispatcher);
