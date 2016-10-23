/**
 * Tap Store.
 * Tell us what we can drink.
 * We're not here to fuck spiders.
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

class TapsStore extends ReduceStore {
  getInitialState() {
    return initialState;
  }

  reduce(state, action) {
    console.log(action, state);
    const { type, data, error } = action;

    // can do global error handling here
    if (error) console.error(error);

    switch (type) {

      case 'REQUEST_FETCH_TAPS':
        return {
          fetching: true,
          fetched: false,
          error: null,
          data: [],
        };

      case 'RECEIVE_FETCH_TAPS':
        return {
          fetching: false,
          fetched: true,
          data: data || [],
          error,
        };

      case 'RECEIVE_CREATE_BEER':
        return {
          fetching: false,
          fetched: true,
          data: state.data.slice().concat([data]),
          error: null,
        };

      default:
        return state;
    }
  }
}

// export a singleton, one is plenty
export default new TapsStore(dispatcher);
