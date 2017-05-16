/**
 * BreweryList Store.
 * Store for the Brewery List
 */

import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';

class BreweryListStore extends ReduceStore {
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

// export as a singleton
export default new BreweryListStore(dispatcher);
