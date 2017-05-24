/**
 * Beers Actions
 */

import dispatcher from '../dispatcher';
import { fetcher, headers, credentials } from './util';
import { addNotification } from './notifications';


// fetch all the beers
export function fetchBeers() {
  dispatcher.dispatch({
    type: 'REQUEST_FETCH_BEERS',
  });

  return fetcher('/api/v1/beers')
  .then((data) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_BEERS',
      data,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_BEERS',
      error,
    });
  });
}

// fetch one beer
export function fetchBeer(id) {
  dispatcher.dispatch({
    type: 'REQUEST_FETCH_BEER',
    id,
  });

  return fetcher(`/api/v1/beers/${id}`)
  .then((data) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_BEER',
      id,
      data,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_BEER',
      id,
      error,
    });
  });
}

// update an existing beer
export function updateBeer(beer) {
  const { id } = beer;

  dispatcher.dispatch({
    type: 'REQUEST_UPDATE_BEER',
    id,
  });

  return fetch(`/api/v1/beers/${id}/`, {
    headers,
    credentials,
    method: 'PUT',
    body: JSON.stringify(beer),
  })
  .then(res => res.json())
  .then((data) => {
    dispatcher.dispatch({
      type: 'RECEIVE_UPDATE_BEER',
      data,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_UPDATE_BEER',
      error,
    });
  });
}

// create a new beer
export function createBeer(beer) {
  dispatcher.dispatch({
    type: 'REQUEST_CREATE_BEER',
  });

  return fetcher('/api/v1/beers/', {
    method: 'POST',
    body: JSON.stringify(beer),
  })
  .then((data) => {
    addNotification('Added your beer 🍻');
    dispatcher.dispatch({
      type: 'RECEIVE_CREATE_BEER',
      data,
    });
  })
  .catch((error) => {
    if (error.isClean && error.code === 400) {
      addNotification('Validation error. Check the form.');
    }
    dispatcher.dispatch({
      type: 'RECEIVE_CREATE_BEER',
      error,
    });
  });
}

export function deleteBeer(beerId) {
  dispatcher.dispatch({
    type: 'REQUEST_DELETE_BEER',
    beerId,
  });

  return fetcher(`/api/v1/beers/${beerId}`, {
    method: 'DELETE',
  })
  .then(() => {
    addNotification('Beer removed.');
    dispatcher.dispatch({
      type: 'RECEIVE_DELETE_BEER',
      beerId,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_DELETE_BEER',
      error,
    });
  });
}

// shows the 'add beer' form in the list view
export function showAddBeer() {
  dispatcher.dispatch({
    type: 'SHOW_ADD_BEER',
  });
}

// toggles the 'edit beer' form in the detail view
export function toggleEditBeer() {
  dispatcher.dispatch({
    type: 'TOGGLE_EDIT_BEER',
  });
}
