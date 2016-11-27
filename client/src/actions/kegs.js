/**
 * Kegs Actions
 */

import dispatcher from '../dispatcher';
import { fetcher, headers, credentials } from './util';
import { addNotification } from './notifications';


// fetch all the kegs
export function fetchKegs() {
  dispatcher.dispatch({
    type: 'REQUEST_FETCH_KEGS',
  });

  return fetch('/api/v1/kegs')
  .then(res => res.json())
  .then((data) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_KEGS',
      data,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_KEGS',
      error,
    });
  });
}

// fetch one keg
export function fetchKeg(id) {
  dispatcher.dispatch({
    type: 'REQUEST_FETCH_KEG',
    id,
  });

  return fetcher(`/api/v1/kegs/${id}`)
  .then((data) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_KEG',
      id,
      data,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_KEG',
      id,
      error,
    });
  });
}

// update an existing keg
export function updateKeg(keg) {
  const { id } = keg;

  dispatcher.dispatch({
    type: 'REQUEST_UPDATE_KEG',
    id,
  });

  return fetch(`/api/v1/kegs/${id}/`, {
    headers,
    credentials,
    method: 'PUT',
    body: JSON.stringify(keg),
  })
  .then(res => res.json())
  .then((data) => {
    dispatcher.dispatch({
      type: 'RECEIVE_UPDATE_KEG',
      data,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_UPDATE_KEG',
      error,
    });
  });
}

// create a new keg
export function createKeg(keg) {
  dispatcher.dispatch({
    type: 'REQUEST_CREATE_KEG',
  });

  return fetch('/api/v1/kegs/', {
    headers,
    credentials,
    method: 'POST',
    body: JSON.stringify(keg),
  })
  .then(res => res.json())
  .then((data) => {
    addNotification('Done.');
    dispatcher.dispatch({
      type: 'RECEIVE_CREATE_KEG',
      data,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_CREATE_KEG',
      error,
    });
  });
}

// rate a keg
export function rateKeg(kegId, value) {
  dispatcher.dispatch({
    type: 'REQUEST_RATE_KEG',
    kegId,
  });

  return fetcher(`/api/v1/kegs/${kegId}/rate`, {
    method: 'PUT',
    body: JSON.stringify({
      value,
    }),
  })
  .then((data) => {
    addNotification('Cheers, homeslice.');
    dispatcher.dispatch({
      type: 'RECEIVE_RATE_KEG',
      kegId,
      data,
    });
  })
  .catch((error) => {
    if (error.isClean && error.code === 401) {
      addNotification('Please log in to rate beers');
    }

    dispatcher.dispatch({
      type: 'RECEIVE_RATE_KEG',
      kegId,
      error,
    });
  });
}
