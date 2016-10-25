/**
 * Kegs Actions
 */

import dispatcher from '../dispatcher';

// fetch options
const headers = new Headers();
headers.set('Content-Type', 'application/json');
const credentials = 'same-origin';


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

  return fetch(`/api/v1/kegs/${id}`)
  .then(res => res.json())
  .then((data) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_KEG',
      data,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_KEG',
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

// toggle editing of a keg
export function toggleEditKeg(kegId) {
  return dispatcher.dispatch({
    type: 'TOGGLE_EDIT_KEG',
    kegId,
  });
}

// toggle creation of a new keg
export function toggleCreateKeg() {
  return dispatcher.dispatch({
    type: 'TOGGLE_CREATE_KEG',
  });
}
