/**
 * Tap Actions
 * Do things that are beer-related.
 */

import dispatcher from '../dispatcher';

// will need these later
const ajaxHeaders = new Headers();
ajaxHeaders.set('Content-Type', 'application/json');

const tapActions = {

  // fetch data from the `ontap` API
  fetchTaps() {
    dispatcher.dispatch({
      type: 'REQUEST_FETCH_TAPS',
    });

    return fetch('/api/v1/ontap')
    .then(res => res.json())
    .then((data) => {
      dispatcher.dispatch({
        type: 'RECEIVE_FETCH_TAPS',
        data,
      });
    })
    .catch((error) => {
      dispatcher.dispatch({
        type: 'RECEIVE_FETCH_TAPS',
        error,
      });
    });
  },

  // PUT an existing beer
  updateBeer(beer) {
    const { id } = beer;

    dispatcher.dispatch({
      type: 'REQUEST_UPDATE_BEER',
      id,
    });

    return fetch(`/api/v1/beers/${id}/`, {
      headers: ajaxHeaders,
      credentials: 'same-origin',
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
  },

  // POST a new beer
  createBeer(beer) {
    dispatcher.dispatch({
      type: 'REQUEST_CREATE_BEER',
    });

    return fetch('/api/v1/beers/', {
      headers: ajaxHeaders,
      credentials: 'same-origin',
      method: 'POST',
      body: JSON.stringify(beer),
    })
    .then(res => res.json())
    .then((data) => {
      dispatcher.dispatch({
        type: 'RECEIVE_CREATE_BEER',
        data,
      });
    })
    .catch((error) => {
      dispatcher.dispatch({
        type: 'RECEIVE_CREATE_BEER',
        error,
      });
    });
  },

};

export default tapActions;
