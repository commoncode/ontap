/**
 * lib/tapontap
 *
 * methods for interfacing with a tapontap instance
 */

const fetch = require('node-fetch');

const { TAPONTAP_INSTANCE } = process.env;

/**
 * Proxy a request to tapontap/status to fetch the uid
 * of the card currently tapped onto the reader.
 * @return {String} Card uid
 */
function getCurrentCard() {
  if (!TAPONTAP_INSTANCE) throw new Error('No TapOnTap instance registered');

  return fetch(`${TAPONTAP_INSTANCE}/api/v1/status`)
  .catch(() => {
    // fetch only throws for network errors
    throw new Error('NETWORK_ERROR');
  })
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('BAD_RESPONSE');
  })
  .then((status) => { // eslint-disable-line arrow-body-style
    return status.card ? status.card.uid : null;
  });
}

/**
 * Proxy to /ping
 * @return {Object}
 */
function ping() {
  if (!TAPONTAP_INSTANCE) throw new Error('No TapOnTap instance registered');

  return fetch(`${TAPONTAP_INSTANCE}/api/v1/ping`)
  .catch(() => {
    throw new Error('NETWORK_ERROR');
  })
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  });
}

module.exports = {
  getCurrentCard,
  ping,
};
