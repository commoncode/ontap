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

  return fetcher('/api/v1/profile')
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

  return fetcher('/api/v1/profile/cheers')
  .then(data => dispatcher.dispatch({
    type: 'RECEIVE_FETCH_PROFILE_CHEERS',
    data,
  }))
  .catch(error => dispatcher.dispatch({
    type: 'RECEIVE_FETCH_PROFILE_CHEERS',
    error,
  }));
}

export function updateProfile(props) {
  dispatcher.dispatch({
    type: 'REQUEST_UPDATE_PROFILE',
  });

  return fetcher('/api/v1/profile', {
    method: 'PUT',
    body: JSON.stringify(props),
  })
  .then(data => dispatcher.dispatch({
    type: 'RECEIVE_UPDATE_PROFILE',
    data,
  }))
  .catch(error => dispatcher.dispatch({
    type: 'RECEIVE_UPDATE_PROFILE',
    error,
  }));
}

export function deleteProfile() {
  dispatcher.dispatch({
    type: 'REQUEST_DELETE_PROFILE',
  });

  return fetcher('/api/v1/profile', {
    method: 'DELETE',
  })
  .then(data => dispatcher.dispatch({
    type: 'RECEIVE_DELETE_PROFILE',
    data,
  }))
  .catch(error => dispatcher.dispatch({
    type: 'RECEIVE_DELETE_PROFILE',
    error,
  }));
}
