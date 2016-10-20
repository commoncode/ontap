/**
 * Profile Store.
 * Don't forget who you are.
 */

import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';

// initial state
const initialState = {
  fetching: false,
  fetched: false,
  error: null,
  data: {},
};

class ProfileStore extends ReduceStore {
  getInitialState() {
    return initialState;
  }

  reduce(state, action) {
    const { type, data, error } = action;

    switch (type) {

      case 'REQUEST_FETCH_PROFILE':
        return {
          fetching: true,
          fetched: false,
          error: null,
          data: {},
        };

      case 'RECEIVE_FETCH_PROFILE':
        return {
          fetching: false,
          fetched: true,
          error,
          data: data || {},
        };

      default:
        return state;
    }
  }
}

export default new ProfileStore(dispatcher);
