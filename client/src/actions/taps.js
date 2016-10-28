/**
 * Tap Actions
 */

import dispatcher from '../dispatcher';

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
