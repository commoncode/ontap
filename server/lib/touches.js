/**
 * lib/touches
 *
 * utilities for handing touches from TapOnTap
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
 * Inserts a Touch, given properties sent from TapOnTap.
 * If .cardUid and .kegId resolve to a Card and Keg respectively,
 * also insert a Cheers and reference it from Touch.cheersId
 * @param  {Object} props
 * @return {Promise} resolves to created model
 */
function createTouch(props) {
  const { cardUid, kegId, timestamp } = props;

  // inserting a couple of rows here so we'll wrap it in a transaction
  return db.sequelize.transaction((transaction) => {
    // do we have a Card with the uid provided by TapOnTap?
    return getCard(cardUid)
    .then((card) => {
      log.debug(`card is ${card ? card.id : null}`);

      // is the kegId valid?
      return checkKeg(kegId)
      .then((kegExists) => {
        log.debug(`kegExists ${kegExists}`);

        if (card && kegExists) {
          // we can reconcile the Card and the Keg, which is enough
          // to create a Cheers, so let's do it.
          const { userId } = card;
          return db.Cheers.create({
            kegId,
            userId,
            timestamp,
          }, {
            transaction,
          });
        }

        // can't reconcile the Card or the Keg so we skip
        // creating a Cheers. if someone registers the Card later,
        // we'll do it then.
        return null;
      })
      .then((cheers) => {
        const cardId = card ? card.id : null;
        const cheersId = cheers ? cheers.id : null;

        // create the Touch row
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
  .then((touch) => {
    // transaction succeeded.
    log.debug('Inserted a Touch:');
    log.debug(touch.get());
  })
  .catch((error) => {
    // something failed, log and rethrow.
    log.error(error);
    throw error;
  });
}


function reconcileTouch(touch) {

}

module.exports = {
  getCard,
  checkKeg,
  createTouch,
};
