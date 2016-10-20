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
    .catch(error => {
      dispatcher.dispatch({
        type: 'RECEIVE_FETCH_TAPS',
        error,
      });
    });
  },
};

export default tapActions;
