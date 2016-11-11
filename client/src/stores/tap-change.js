/**
 * Tap Change Store.
 * State management for TapChange component.
 * todo - make Immutable Map, like the others.
 */

import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';

class TapChangeStore extends ReduceStore {
  getInitialState() {
    return {
      tap: null,
      kegs: [],
      fetching: false,
      fetched: false,
      error: null,
    };
  }

  reduce(state, action) {
    const { type, data, error } = action;

    switch (type) {

      case 'RECEIVE_CHANGE_TAP':
        return {
          fetching: false,
          fetched: true,
          error,
          tap: data,
          kegs: state.kegs,
        };


      case 'REQUEST_FETCH_TAP_WITH_KEGS':
        return {
          fetching: true,
          fetched: false,
          error: null,
          tap: null,
          kegs: [],
        };

      case 'RECEIVE_FETCH_TAP_WITH_KEGS':
        return {
          fetching: false,
          fetched: true,
          error,
          tap: data.tap || null,
          kegs: data.kegs || [],
        };

      default:
        return state;
    }
  }
}

export default new TapChangeStore(dispatcher);
