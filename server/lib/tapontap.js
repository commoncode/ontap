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
    throw new Error('TapOnTap instance unreachable');
  })
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unable to parse TapOnTap response');
  })
  .then((status) => {
    console.log(status);
    return status.card ? status.card.uid : null;
  });
}


module.exports = {
  getCurrentCard,
};
