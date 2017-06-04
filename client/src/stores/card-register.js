/**
 * Card Register store.
 * Basically a state machine for the CardRegister view.
 */

import { ReduceStore } from 'flux/utils';

import dispatcher from '../dispatcher';

// parse http responses into human-readable messages for the client
function parseFetchError(error) {
  if (error.isClean) {
    switch (error.code) {
      case 504:
        return 'Network Error: Can\'t reach TapOnTap instance.';
      case 502:
        return 'Bad gateway: Got a bad response from TapOnTap instance.';
      default:
        return error.message;
    }
  }
  return error.toString();
}

const initialState = {
  step: 0,
  cardUid: null, // uid sent from tapontap.
  error: null,
  loading: false,
  badCard: false,
  duplicateCard: false,
  registeredCard: null,
};

class CardRegisterStore extends ReduceStore {
  getInitialState() {
    return initialState;
  }

  reduce(state, action) { // eslint-disable-line class-methods-use-this
    const { type, error } = action;

    switch (type) {

      case 'CARD_REGISTER_RESET':
        return initialState;

      case 'CARD_REGISTER_STEP_TO':
        return {
          step: action.step,
        };

      case 'REQUEST_FETCH_CARD':
        return {
          cardUid: null,
          error: null,
          loading: true,
          badCard: false,
        };

      case 'RECEIVE_FETCH_CARD': {
        // error
        if (error) {
          return {
            cardUid: null,
            error: parseFetchError(error),
            loading: false,
          };
        }

        // no card or invalid card on the reader
        if (action.cardUid === null) {
          return {
            cardUid: null,
            badCard: true,
            error: null,
            loading: false,
          };
        }

        // success, save carduid and push to next step
        return {
          step: 3,
          cardUid: action.cardUid,
          error: null,
          loading: false,
          badCard: false,
        };
      }

      case 'REQUEST_REGISTER_CARD':
        return {
          error: null,
          loading: true,
        };

      case 'RECEIVE_REGISTER_CARD':
        // duplicate card
        if (error && error.code === 409) {
          return {
            loading: false,
            duplicateCard: true,
            error: null,
          };
        }

        // some other error
        if (error) {
          return {
            loading: false,
            error: parseFetchError(error),
          };
        }

        // no problem
        return {
          error: null,
          loading: false,
          registeredCard: action.data,
        };

      case 'CARD_REGISTER_RETRY':
        // go back to step 2
        return {
          ...initialState,
          step: 2,
        };

      default:
        return state;
    }
  }
}

export default new CardRegisterStore(dispatcher);
