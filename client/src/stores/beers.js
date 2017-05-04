/**
 * Beers Store.
 * A store for the Beer List view.
 */

import Immutable from 'immutable';
import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';


// array of beer objects -> Immutable Map
// todo - duplicated in kegs store, move to utils. it's just "array to map".
function beersToMap(beers = []) {
  return new Immutable.Map().withMutations((map) => {
    beers.forEach((beer) => {
      map.set(beer.id, beer);
    });
    return map;
  });
}

class BeerMapStore extends ReduceStore {

  getInitialState() {
    const sync = new Immutable.Map({
      fetching: false,
      fetched: false,
      error: null,
    });
    const beers = new Immutable.Map();
    const create = new Immutable.Map({
      showForm: false,
      syncing: false,
      error: false,
    });
    return new Immutable.Map()
      .mergeIn(['sync'], sync)
      .mergeIn(['beers'], beers)
      .mergeIn(['create'], create);
  }

  // eslint-disable-next-line class-methods-use-this
  reduce(state, action) {
    const { type, data, error } = action;
    if (error) console.error(error);

    switch (type) {

      // fetch all the beers
      case 'REQUEST_FETCH_BEERS':
        return state.set('sync', new Immutable.Map({
          fetching: true,
          fetched: false,
          error: null,
        })).set('beers', new Immutable.Map());

      case 'RECEIVE_FETCH_BEERS':
        return state.set('sync', new Immutable.Map({
          fetching: false,
          fetched: true,
          error: error || null,
        })).set('beers', beersToMap(data));

      case 'REQUEST_CREATE_BEER':
        return state.setIn(['create', 'syncing'], true);

      case 'RECEIVE_CREATE_BEER':
        if (error) {
          // todo - better to handle errors here (ie notifications)
          // or to do in the action creator?
          return state
            .setIn(['create', 'syncing'], false);
        }

        return state
          .setIn(['beers', data.id], data)
          .setIn(['create', 'showForm'], false)
          .setIn(['create', 'syncing'], false);

      case 'SHOW_ADD_BEER':
        return state.setIn(['create', 'showForm'], true);

      default:
        return state;
    }
  }

}

export default new BeerMapStore(dispatcher);
