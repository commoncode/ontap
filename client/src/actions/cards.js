/**
 * Card Actions
 */

import dispatcher from '../dispatcher';
import { fetcher } from './util';
import { addNotification } from './notifications';


// delete a card
export function deleteCard(id) { // eslint-disable-line import/prefer-default-export
  dispatcher.dispatch({
    type: 'REQUEST_DELETE_CARD',
    id,
  });

  return fetcher(`/api/v1/cards/${id}`, {
    method: 'DELETE',
  })
  .then(() => {
    dispatcher.dispatch({
      type: 'RECEIVE_DELETE_CARD',
      id,
    });
    addNotification('Removed your NFC Token.');
  })
  .catch((error) => {
    dispatcher.dispatch({
      type: 'RECEIVE_DELETE_CARD',
      error,
    });

    throw error; // rethrow for action caller
  });
}
