/**
 * Keg Detail store.
 * State management for Keg Detail component.
 */

import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';

class KegDetailStore extends ReduceStore {
  getInitialState() {
    return {
      fetching: false,
      pushing: false,
      editing: false,
      error: null,
      model: null,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  reduce(state, action) {
    const { type, data, error } = action;

    switch (type) {

      case 'REQUEST_FETCH_KEG':
        return {
          fetching: true,
          pushing: false,
          error: null,
          model: null,
        };

      case 'RECEIVE_FETCH_KEG':
      case 'RECEIVE_UPDATE_KEG':
        if (error) {
          return {
            fetching: false,
            pushing: false,
            error,
            model: state.model,
          };
        }

        return {
          fetching: false,
          pushing: false,
          error: null,
          model: Object.assign({}, state.model, data),
        };

      case 'RECEIVE_CHEERS_KEG':
        // payload is the Cheers
        return {
          fetching: false,
          pushing: false,
          error: error || null,
          model: data ? {
            ...state.model,
            Cheers: data,
          } : state.model,
        };


      default:
        return state;
    }
  }
}

// singleton, but you could actually have many.
// would require the reducer to check against an id.
export default new KegDetailStore(dispatcher);
