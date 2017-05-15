/**
 * Breweries Actions
 */

import dispatcher from '../dispatcher';
import { fetcher } from './util';
// import { addNotification } from './notifications';


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
