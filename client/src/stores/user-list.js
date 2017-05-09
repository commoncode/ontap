/**
 * User List store.
 * State management for User List component.
 */

import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';

class UserListStore extends ReduceStore {
  getInitialState() {
    return {
      fetching: false,
      error: null,
      models: [],
    };
  }

  reduce(state, action) {
    const { type, data, error } = action;

    switch (type) {

      case 'REQUEST_FETCH_USERS':
        return {
          fetching: true,
          error: null,
          models: [],
        };

      case 'RECEIVE_FETCH_USERS':
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

// just a singleton
export default new UserListStore(dispatcher);
