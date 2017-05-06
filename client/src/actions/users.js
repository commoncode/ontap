/**
 * User Actions
 */

import dispatcher from '../dispatcher';
import { fetcher } from './util';
import { addNotification } from './notifications';


// fetch one user
export function fetchUser(id) {
  dispatcher.dispatch({
    type: 'REQUEST_FETCH_USER',
    id,
  });

  return fetcher(`/api/v1/users/${id}`)
  .then((data) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_USER',
      id,
      data,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_USER',
      id,
      error,
    });
  });
}

// fetch all users
export function fetchUsers() {
  dispatcher.dispatch({
    type: 'REQUEST_FETCH_USERS',
  });

  return fetcher('/api/v1/users')
  .then((data) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_USERS',
      data,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_USERS',
      error,
    });
  });
}

// update a user
export function updateUser(id, props) {
  dispatcher.dispatch({
    type: 'REQUEST_UPDATE_USER',
    id,
  });

  return fetcher(`/api/v1/users/${id}`, {
    method: 'POST',
    body: JSON.stringify(props),
  })
  .then((data) => {
    dispatcher.dispatch({
      type: 'RECEIVE_UPDATE_USER',
      data,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_UPDATE_USER',
      error,
    });

    addNotification(error.message);

    throw error; // rethrow for the caller of the action to catch
  });
}
