/**
 * Breweries Actions
 */

import dispatcher from '../dispatcher';
import { fetcher } from './util';

// fetch all breweries
export function fetchBreweries() {
  dispatcher.dispatch({
    type: 'REQUEST_FETCH_BREWERIES',
  });

  return fetcher('/api/v1/breweries')
  .then((data) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_BREWERIES',
      data,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_BREWERIES',
      error,
    });
  });
}

// fetch a single brewery
export function fetchBrewery(id) {
  dispatcher.dispatch({
    type: 'REQUEST_FETCH_BREWERY',
    id,
  });

  return fetcher(`/api/v1/breweries/${id}`)
  .then((data) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_BREWERY',
      id,
      data,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_BREWERY',
      id,
      error,
    });
  });
}
