/**
 * Kegs Store.
 * A cellar?
 */

import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';

// initial state
const initialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: [],
};

class KegsStore extends ReduceStore {
  getInitialState() {
    return initialState;
  }

  reduce(state, action) {
    const { type, data, error } = action;

    switch (type) {

      case 'REQUEST_FETCH_KEGS':
        return {
          fetching: true,
          fetched: false,
          error: null,
          data: [],
        };

      case 'RECEIVE_FETCH_KEGS':
        return {
          fetching: false,
          fetched: true,
          data: data || [],
          error,
        };

      default:
        return state;
    }
  }
}

export default new KegsStore(dispatcher);
