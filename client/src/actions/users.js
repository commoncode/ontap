/**
 * User Actions
 */

import dispatcher from '../dispatcher';
import { fetcher, headers, credentials } from './util';


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
