/**
 * Breweries Actions
 */

import dispatcher from '../dispatcher';
import { fetcher } from './util';
import { addNotification } from './notifications';

// fetch all breweries
export function fetchBreweries() {
  dispatcher.dispatch({
    type: 'REQUEST_FETCH_BREWERIES',
  });

  return fetcher('/api/v1/breweries')
  .then(data => dispatcher.dispatch({
    type: 'RECEIVE_FETCH_BREWERIES',
    data,
  }))
  .catch(error => dispatcher.dispatch({
    type: 'RECEIVE_FETCH_BREWERIES',
    error,
  }));
}

// fetch a single brewery
export function fetchBrewery(id) {
  dispatcher.dispatch({
    type: 'REQUEST_FETCH_BREWERY',
    id,
  });

  return fetcher(`/api/v1/breweries/${id}`)
  .then(data => dispatcher.dispatch({
    type: 'RECEIVE_FETCH_BREWERY',
    id,
    data,
  }))
  .catch(error => dispatcher.dispatch({
    type: 'RECEIVE_FETCH_BREWERY',
    id,
    error,
  }));
}

// update a brewery
export function updateBrewery(id, props) {
  dispatcher.dispatch({
    type: 'REQUEST_UPDATE_BREWERY',
    id,
  });

  return fetcher(`/api/v1/breweries/${id}`, {
    body: JSON.stringify(props),
    method: 'PUT',
  })
  .then(data => dispatcher.dispatch({
    type: 'RECEIVE_UPDATE_BREWERY',
    id,
    data,
  }))
  .then(() => addNotification('Beer updated.'))
  .catch(error => dispatcher.dispatch({
    type: 'RECEIVE_UPDATE_BREWERY',
    id,
    error,
  }));
}

// delete a brewery
export function deleteBrewery(id) {
  dispatcher.dispatch({
    type: 'REQUEST_DELETE_BREWERY',
    id,
  });

  return fetcher(`/api/v1/breweries/${id}`, {
    method: 'DELETE',
  })
  .then(() => dispatcher.dispatch({
    type: 'RECEIVE_DELETE_BREWERY',
    id,
  }))
  .catch(error => dispatcher.dispatch({
    type: 'RECEIVE_DELETE_BREWERY',
    id,
    error,
  }));
}
