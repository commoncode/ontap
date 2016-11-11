/**
 * Tap Actions
 */

import dispatcher from '../dispatcher';
import { fetcher } from './util';


export const fetchTaps = () => {
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
};

export const fetchTapWithKegs = (tapId) => {
  dispatcher.dispatch({
    type: 'REQUEST_FETCH_TAP_WITH_KEGS',
    tapId,
  });

  return Promise.all([
    fetcher(`/api/v1/taps/${tapId}`),
    fetcher('/api/v1/kegs/new'),
  ])
  .then(([tap, kegs]) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_TAP_WITH_KEGS',
      data: {
        tap,
        kegs,
      },
      error: null,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_FETCH_TAP_WITH_KEGS',
      data: {},
      error,
    });
  });
};

export const changeTap = ({ tapId, kegId = null, tapped = null, untapped = null }) => {
  dispatcher.dispatch({
    type: 'REQUEST_CHANGE_TAP',
    tapId,
  });

  return fetcher(`/api/v1/taps/${tapId}/keg`, {
    method: 'POST',
    body: JSON.stringify({
      kegId,
      tapped,
      untapped,
    }),
  })
  .then((data) => {
    dispatcher.dispatch({
      type: 'RECEIVE_CHANGE_TAP',
      data,
    });
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_CHANGE_TAP',
      error,
    });
  });
};
