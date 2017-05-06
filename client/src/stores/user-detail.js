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

  reduce(state, action) { // eslint-disable-line class-methods-use-this
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

      case 'RECEIVE_UPDATE_USER':
        if (error) {
          return {
            fetching: false,
            error,
            model: state.model,
          };
        }

        if (data.id !== state.model.id) {
          return state;
        }

        return {
          fetching: false,
          error: null,
          model: Object.assign(state.model, data),
        };

      default:
        return state;
    }
  }
}

// just a singleton
export default new UserDetailStore(dispatcher);
