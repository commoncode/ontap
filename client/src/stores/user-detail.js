/**
 * User Detail store.
 * State management for User Detail component.
 */

import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';

class UserDetailStore extends ReduceStore {
  getInitialState() {
    return {
      fetching: false,
      error: null,
      model: null,
    };
  }

  reduce(state, action) {
    const { type, data, error } = action;

    switch (type) {

      case 'REQUEST_FETCH_USER':
        return {
          fetching: true,
          error: null,
          model: null,
        };

      case 'RECEIVE_FETCH_USER':
        return {
          fetching: false,
          error: error || null,
          model: data || null,
        };

      default:
        return state;
    }
  }
}

// just a singleton
export default new UserDetailStore(dispatcher);
