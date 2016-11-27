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
        return {
          fetching: false,
          pushing: false,
          editing: !!error,
          error: error || null,
          model: data || null,
        };

      case 'RECEIVE_VOTE_FOR_BEER':
      case 'RECEIVE_UNVOTE_FOR_BEER':
        // payload is the new votes array
        return Object.assign({}, state, {
          model: Object.assign({}, state.model, {
            Votes: data,
          }),
        });

      case 'RECEIVE_CLEAR_VOTES':
        return Object.assign({}, state, {
          model: Object.assign({}, state.model, {
            Votes: [],
          }),
        });

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
