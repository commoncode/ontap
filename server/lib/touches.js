/**
 * lib/touches
 *
 * utilities for handing touches from tapontap
 */

const db = require('lib/db');
const log = require('lib/logger');


/**
 * Get a Card given its uid
 * @param  {String} uid
 * @return {Promise} resolves to Card or null
 */
function getCard(uid) {
  return db.Card.findOne({
    where: {
      uid,
    },
  });
}

/**
 * Return whether a Keg with matching id exists
 * @param  {Number} id
 * @return {Promise} resolves to boolean
 */
function checkKeg(id) {
  return db.Keg.findOne({
    where: {
      id,
    },
  })
  .then(kegOrNull => !!kegOrNull);
}


/**
 * Creates a Touch, given properties sent from TapOnTap
 * @param  {Object} props
 * @return {Promise} resolves to created model
 */
function createTouch(props) {
  // check if the card is known
  // check whether the kegId is legit

  const { cardUid, kegId, timestamp } = props;

  db.sequelize.transaction((transaction) => {
    return getCard(cardUid)
    .then((card) => {
      log.debug(`card is ${card ? card.id : null}`);
      return checkKeg(kegId)
      .then((kegExists) => {
        log.debug(`kegExists ${kegExists}`);
        if (card && kegExists) {
          const { userId } = card;
          return db.Cheers.create({
            kegId,
            userId,
            timestamp,
          }, {
            transaction,
          });
        }

        return null;
      })
      .then((cheers) => {
        const cardId = card ? card.id : null;
        const cheersId = cheers ? cheers.id : null;

        return db.Touch.create({
          cardUid,
          cardId,
          kegId,
          timestamp,
          cheersId,
        }, {
          transaction,
        });
      });
    });
  })
  .then(() => {
    console.log('success');
    // transaction succeeded.
  })
  .catch(err => {
    console.log('explosion');
    console.error(err);
    // transaction failed.
  })
}

module.exports = {
  getCard,
  checkKeg,
  createTouch,
};
