/**
 * Notification Actions.
 * Add and remove notifications.
 */

import dispatcher from '../dispatcher';

// add a notification
export function addNotification(message) {
  return dispatcher.dispatch({
    type: 'ADD_NOTIFICATION',
    data: {
      message,
    },
  });
}

// remove a notification
export function removeNotification(id) {
  return dispatcher.dispatch({
    type: 'REMOVE_NOTIFICATION',
    data: id,
  });
}
