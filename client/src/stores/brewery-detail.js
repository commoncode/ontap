import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';

class BreweryDetailStore extends ReduceStore {
  getInitialState() {
    return {
      fetching: false,
      error: null,
      model: null,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  reduce(state, action) {
    const { type, data, error } = action;

    switch (type) {

      case 'REQUEST_FETCH_BREWERY':
        return {
          fetching: true,
          error: null,
          model: null,
        };

      case 'RECEIVE_FETCH_BREWERY':
        return {
          fetching: false,
          error: error || null,
          model: data || null,
        };

      case 'RECEIVE_UPDATE_BREWERY':
        return {
          fetching: false,
          error: error || null,
          model: {
            ...state.model,
            ...(data || {}),
          },
        };

      default:
        return state;
    }
  }
}

// export as singleton
export default new BreweryDetailStore(dispatcher);
