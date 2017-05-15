/**
 * Beer Detail store.
 * State management for Beer Detail component.
 */

import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';

class BeerDetailStore extends ReduceStore {
  getInitialState() {
    return {
      fetching: false,
      pushing: false,
      editing: false,
      error: null,
      model: null,
    };
  }

  reduce(state, action) {
    const { type, data, error } = action;

    switch (type) {

      case 'REQUEST_FETCH_BEER':
        return {
          fetching: true,
          pushing: false,
          editing: false,
          error: null,
          model: null,
        };

      case 'RECEIVE_FETCH_BEER':
        return {
          fetching: false,
          pushing: false,
          editing: false,
          error: error || null,
          model: data || null,
        };

      case 'RECEIVE_UPDATE_BEER':
        if (error) {
          return {
            fetching: false,
            pushing: false,
            editing: true,
            error,
            model: state.model,
          };
        }

        // merge updates into current state,
        // API will only return what it needs to.
        return {
          fetching: false,
          pushing: false,
          editing: false,
          error: null,
          model: Object.assign({}, state.model, data),
        };

      case 'TOGGLE_EDIT_BEER':
        return Object.assign({}, state, {
          editing: !state.editing,
        });

      default:
        return state;
    }
  }
}

export default new BeerDetailStore(dispatcher);
