/**
 * notifications store.
 * store is a Map, store.notifications is a List
 */

import { ReduceStore } from 'flux/utils';
import Immutable from 'immutable';

import dispatcher from '../dispatcher';


class NotificationsStore extends ReduceStore {
  getInitialState() {
    return new Immutable.Map().set('notifications', new Immutable.List());
  }

  // eslint-disable-next-line class-methods-use-this
  reduce(state, action) {
    const { type, data } = action;
    switch (type) {

      case 'ADD_NOTIFICATION': {
        return state.set('notifications', state.get('notifications').push(data));
      }

      case 'REMOVE_NOTIFICATION': {
        // data is the key index
        return state.set('notifications', state.get('notifications').delete(data));
      }

      default:
        return state;
    }
  }
}

export default new NotificationsStore(dispatcher);
