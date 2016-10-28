/**
 * Tap Store.
 * Tell us what we can drink.
 * We're not here to fuck spiders.
 */

import Immutable from 'immutable';
import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';


function jsonToTap(model = {}) {
  return new Immutable.Map({
    fetching: false,
    editing: false,
    syncing: false,
    error: null,
    model,
  });
}

function tapsToMap(taps = []) {
  return new Immutable.Map().withMutations((map) => {
    taps.forEach((tap) => {
      map.set(tap.id, jsonToTap(tap));
    });
    return map;
  });
}


class TapsStore extends ReduceStore {
  getInitialState() {
    const sync = new Immutable.Map({
      fetching: false,
      fetched: false,
      error: null,
    });
    const taps = new Immutable.Map();
    return new Immutable.Map().mergeIn(['sync'], sync).mergeIn(['taps'], taps);
  }

  reduce(state, action) {
    const { type, data, error } = action;

    switch (type) {
      case 'REQUEST_FETCH_TAPS':
        return state.set('sync', new Immutable.Map({
          fetching: true,
          fetched: false,
          error: null,
        })).set('taps', new Immutable.Map());

      case 'RECEIVE_FETCH_TAPS':
        return state.set('sync', new Immutable.Map({
          fetching: false,
          fetched: true,
          error: error || null,
        })).set('taps', tapsToMap(data));

      default:
        return state;
    }
  }
}

// export a singleton, one is plenty
export default new TapsStore(dispatcher);
