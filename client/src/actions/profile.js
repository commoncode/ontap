/**
 * Profile Actions
 * Do profiley things.
 */

import dispatcher from '../dispatcher';
import { fetcher } from './util';


// find out who we are
export function fetchProfile() {
  dispatcher.dispatch({
    type: 'REQUEST_FETCH_PROFILE',
  });

  return fetcher('/api/v1/whoami')
  .then(data => dispatcher.dispatch({
    type: 'RECEIVE_FETCH_PROFILE',
    data,
  }))
  .catch(error => dispatcher.dispatch({
    type: 'RECEIVE_FETCH_PROFILE',
    error,
  }));
}

// fetch the Cheers for our profile.
export function fetchProfileCheers() {
  dispatcher.dispatch({
    type: 'REQUEST_FETCH_PROFILE_CHEERS',
  });

  return fetcher('/api/v1/whoami/cheers')
  .then(data => dispatcher.dispatch({
    type: 'RECEIVE_FETCH_PROFILE_CHEERS',
    data,
  }))
  .catch(error => dispatcher.dispatch({
    type: 'RECEIVE_FETCH_PROFILE_CHEERS',
    error,
  }));
}
