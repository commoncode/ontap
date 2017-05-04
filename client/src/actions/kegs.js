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
    return data;
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
    return data;
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_CREATE_KEG',
      error,
    });
  });
}

// cheers a keg
export function cheersKeg(kegId) {
  dispatcher.dispatch({
    type: 'REQUEST_CHEERS_KEG',
    kegId,
  });

  return fetcher(`/api/v1/kegs/${kegId}/cheers`, {
    method: 'POST',
  })
  .then((data) => {
    addNotification('Cheers!');
    dispatcher.dispatch({
      type: 'RECEIVE_CHEERS_KEG',
      kegId,
      data,
    });
  })
  .catch((error) => {
    if (error.isClean && error.code === 401) {
      addNotification('Please log in to cheers');
    }

    dispatcher.dispatch({
      type: 'RECEIVE_CHEERS_KEG',
      kegId,
      error,
    });
  });
}

// delete a keg
export function deleteKeg(kegId) {
  dispatcher.dispatch({
    type: 'REQUEST_DELETE_KEG',
    kegId,
  });

  return fetcher(`/api/v1/kegs/${kegId}`, {
    method: 'DELETE',
  })
  .then(() => {
    addNotification('Keg removed');
    dispatcher.dispatch({
      type: 'RECEIVE_DELETE_KEG',
      kegId,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_DELETE_BEER',
      error,
    });
  });
}
