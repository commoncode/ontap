/**
 * notifications store.
 * display a flash notification at the top of the app.
 *
 * store is an Immutable Map
 * .notifications is an Immutable List
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
        // this is a list but i got booed by everybody when they stacked up at the top
        // so for now, adding a new notification will clear the last one.
        // leaving it as a list though in case we
        return state.set('notifications', new Immutable.List().push(data));
      }

      case 'REMOVE_NOTIFICATION': {
        // see comment above, we only show 1 notification at a time so we can just
        // nuke the whole list
        return state.set('notifications', new Immutable.List());
      }

      default:
        return state;
    }
  }
}

export default new NotificationsStore(dispatcher);
