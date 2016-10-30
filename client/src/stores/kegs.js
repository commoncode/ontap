// MapStore
// they nuked it from flux/utils so i've rolled it myself

import Immutable from 'immutable';
import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';


// creates a new Map that represents a keg
// has a bunch of meta properties on it,
// and .model points to the actual model data.
function jsonToKeg(model = {}) {
  return new Immutable.Map({
    fetching: false,
    editing: false,
    syncing: false,
    error: null,
    model,
  });
}

// turn an array of keg json objects into an
// Immutable Map
function kegsToMap(kegs = []) {
  return new Immutable.Map().withMutations((map) => {
    kegs.forEach((keg) => {
      map.set(keg.id, jsonToKeg(keg));
    });
    return map;
  });
}

class KegMapStore extends ReduceStore {

  getInitialState() {
    const sync = new Immutable.Map({
      fetching: false,
      fetched: false,
      error: null,
    });
    const kegs = new Immutable.Map();
    return new Immutable.Map().mergeIn(['sync'], sync).mergeIn(['kegs'], kegs);
  }

  reduce(state, action) {
    const { type, data, error } = action;

    console.log({
      type, data, error,
    });

    switch (type) {

      // fetch all kegs
      case 'REQUEST_FETCH_KEGS':
        return state.set('sync', new Immutable.Map({
          fetching: true,
          fetched: false,
          error: null,
        })).set('kegs', new Immutable.Map());

      // fetch single keg
      case 'REQUEST_FETCH_KEG':
        return state.setIn(['kegs', action.id], jsonToKeg().set('fetching', true));

      case 'RECEIVE_FETCH_KEGS':
        return state.set('sync', new Immutable.Map({
          fetching: false,
          fetched: true,
          error: error || null,
        })).set('kegs', kegsToMap(data));

      case 'RECEIVE_FETCH_KEG':
        return state.setIn(['kegs', action.id],
          jsonToKeg(data)
          .set('error', error || null)
          .set('fetching', false)
        );

      case 'TOGGLE_EDIT_KEG': {
        const currentToggleState = state.getIn(['kegs', action.kegId, 'editing']);
        return state.setIn(['kegs', action.kegId, 'editing'], !currentToggleState);
      }

      case 'REQUEST_UPDATE_KEG':
        return state.setIn(['kegs', action.id, 'syncing'], true);

      case 'RECEIVE_UPDATE_KEG':
        return state.setIn(['kegs', data.id], jsonToKeg(data));

      case 'RECEIVE_CREATE_KEG':
        return state.setIn(['kegs', data.id], jsonToKeg(data));

      default:
        return state;
    }
  }

}

export default new KegMapStore(dispatcher);
