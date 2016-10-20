/**
 * Profile Actions
 * Do profiley things.
 */

import dispatcher from '../dispatcher';

const profileActions = {

  // find out who we are
  whoami() {
    dispatcher.dispatch({
      type: 'REQUEST_FETCH_PROFILE',
    });

    return fetch('/whoami', {
      credentials: 'same-origin',
    })
    .then(res => res.json())
    .then((data) => {
      dispatcher.dispatch({
        type: 'RECEIVE_FETCH_PROFILE',
        data,
      });
    })
    .catch(error => {
      dispatcher.dispatch({
        type: 'RECEIVE_FETCH_PROFILE',
        error,
      });
    });
  },
};

export default profileActions;
