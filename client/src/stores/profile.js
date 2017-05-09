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

      case 'RECEIVE_FETCH_PROFILE_CHEERS':
        if (error) {
          return {
            fetching: state.fetching,
            data: state.data,
            error,
          };
        }

        return {
          fetching: state.fetching,
          data: Object.assign({}, state.data, {
            Cheers: data,
          }),
          error: null,
        };

      // update user modifies the profile if it's you
      case 'RECEIVE_UPDATE_USER': {
        if (error) {
          return {
            fetching: false,
            data: state.data,
            error,
          };
        }

        if (data.id !== state.data.id) {
          return state;
        }

        return {
          fetching: false,
          error: null,
          data: Object.assign(data, {
            Cheers: state.data.Cheers, // don't clobber Cheers
          }),
        };
      }

      default:
        return state;
    }
  }
}

export default new ProfileStore(dispatcher);
