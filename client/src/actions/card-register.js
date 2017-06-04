/**
 * CardRegister Actions.

 */

import dispatcher from '../dispatcher';
import { fetcher } from './util';


// reset the store to intial values
export function reset() {
  dispatcher.dispatch({
    type: 'CARD_REGISTER_RESET',
  });
}

// Transition to a different step
export function stepTo(step) {
  dispatcher.dispatch({
    type: 'CARD_REGISTER_STEP_TO',
    step,
  });
}

// retry with a different token
export function retry() {
  dispatcher.dispatch({
    type: 'CARD_REGISTER_RETRY',
  });
}

// fetch card uid from TapOnTap
export function fetchCard() {
  dispatcher.dispatch({
    type: 'REQUEST_FETCH_CARD',
  });

  return fetcher('/api/v1/cards/register')
  .then(({ cardUid }) => dispatcher.dispatch({
    type: 'RECEIVE_FETCH_CARD',
    cardUid,
  }))
  .catch(error => dispatcher.dispatch({
    type: 'RECEIVE_FETCH_CARD',
    error,
  }));
}

// register the card to the current user
export function registerCard(uid) {
  dispatcher.dispatch({
    type: 'REQUEST_REGISTER_CARD',
  });

  return fetcher('/api/v1/cards/register', {
    method: 'POST',
    body: JSON.stringify({
      uid,
    }),
  })
  .then(data => dispatcher.dispatch({
    type: 'RECEIVE_REGISTER_CARD',
    data,
  }))
  .catch(error => dispatcher.dispatch({
    type: 'RECEIVE_REGISTER_CARD',
    error,
  }));
}
