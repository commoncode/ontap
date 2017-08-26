/**
 * Profile Store.
 * Don't forget who you are.
 * todo - make it an ImmutableMap like the others, for consistency.
 */

import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';

// initial state
const initialState = {
  fetching: false,
  error: null,
  data: {},
};

class ProfileStore extends ReduceStore {
  getInitialState() {
    return initialState;
  }

  reduce(state, action) { // eslint-disable-line class-methods-use-this
    const { type, data, error } = action;

    switch (type) {

      case 'REQUEST_FETCH_PROFILE':
        return {
          fetching: true,
          data: {},
          error: null,
        };

      case 'RECEIVE_FETCH_PROFILE':
        return {
          fetching: false,
          data: data || {},
          error: error || null,
        };

      case 'RECEIVE_FETCH_PROFILE_FULL':
        if (error) {
          return {
            fetching: state.fetching,
            data: state.data,
            error,
          };
        }

        return {
          fetching: state.fetching,
          data,
          error: null,
        };

      case 'RECEIVE_UPDATE_PROFILE':
        if (error) {
          return {
            fetching: null,
            data: state.data,
            error,
          };
        }

        // extend current state so we don't overwrite
        // other props like Cheers
        return {
          fetching: false,
          error: null,
          data: {
            ...state.data,
            ...data,
          },
        };

      case 'RECEIVE_DELETE_CARD':
        // remove the deleted card
        return {
          data: error ? state.data : {
            ...state.data,
            Cards: (state.data.Cards || []).filter(card => card.id !== action.id),
          },
          error: error || null,
        };

      default:
        return state;
    }
  }
}

export default new ProfileStore(dispatcher);
