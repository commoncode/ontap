/**
 * lib/touches
 *
 * utilities for handing touches from TapOnTap
 */

const db = require('lib/db');
const log = require('lib/logger');


/**
 * Get a Card by uid
 * @param  {String} uid
 * @return {Promise.Card|null}
 */
function getCard(uid) {
  return db.Card.findOne({
    where: {
      uid,
    },
  })
  .then((card) => { // eslint-disable-line arrow-body-style
    return card ? card.get() : null;
  });
}

/**
 * Return whether a Keg with matching id exists
 * @param  {Number} id
 * @return {Promise.boolean}
 */
function getKeg(id) {
  return db.Keg.findOne({
    where: {
      id,
    },
  })
  .then((keg) => { // eslint-disable-line arrow-body-style
    return keg ? keg.get() : null;
  });
}

/**
 * Attempt to reconcile touch.cardUid and touch.kegId
 * to a Card and Keg, returning them in an object.
 * @param  {Object} touch
 * @return {Object}
 * @return {Object|null} return.card
 * @return {Object|null} return.keg
 */
function reconcileCardAndKeg(touch) {
  const { cardUid, kegId } = touch;

  return Promise.resolve()
  .then(() => getCard(cardUid))
  .then(card => getKeg(kegId)
    .then(keg => ({
      card,
      keg,
    }))
  );
}

/**
 * Attempt to create a Cheers from a Touch.
 * @param  {Object} touch
 * @param  {Sequelize.Transaction} [transaction=null]
 * @return {Promise.Object}
 * @return {Object|null} return.cheers
 * @return {Object|null} return.card
 * @return {Object|null} return.keg
 */
function createCheersFromTouch(touch, transaction = null) {
  return reconcileCardAndKeg(touch)
  .then(({ card, keg }) => {
    if (card && keg) {
      // card and keg resolve, create a Cheers.
      const { userId } = card;
      const { timestamp, kegId } = touch;
      return db.Cheers.create({
        kegId,
        userId,
        timestamp,
      }, {
        transaction,
      })
      .then(cheers => cheers.get())
      .then(cheers => ({
        cheers,
        card,
        keg,
      }));
    }
    // card or keg couldn't resolve, cheers is null.
    const cheers = null;
    return {
      cheers,
      card,
      keg,
    };
  });
}


/**
 * Inserts a Touch, given properties sent from TapOnTap.
 * If .cardUid and .kegId resolve to a Card and Keg respectively,
 * also insert a Cheers and reference it from Touch.cheersId
 * @param  {Object} props
 * @return {Promise.Touch}
 */
function createTouch(props) {
  const { cardUid, kegId, timestamp } = props;

  // transact this so if one fails neither get written
  return db.sequelize.transaction(transaction =>
    createCheersFromTouch(props, transaction)
    .then(({ card, cheers }) => {
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
    })
    .then((touch) => {
      // transaction succeeded.
      log.debug('Inserted a Touch:');
      log.debug(touch.get());
      return touch.get();
    })
    .catch((error) => {
      // something failed, log and rethrow.
      log.error(error);
      throw error;
    }));
}


/**
 * Wraps createTouch() to process an array of touches in sequence.
 * todo - a single failure will stop them all. think about how to handle.
 * @param  {Array} touches
 * @return {Promise.Touch[]}  array of touches
 */
function createTouches(touches) {
  return touches.reduce((promise, props) =>
    promise.then(returnArray =>
      createTouch(props)
      .then(touch => [...returnArray, touch])
    )
  , Promise.resolve([]));
}


/**
 * Attempt to reconcile Card and Keg from an existing Touch,
 * updating the Touch row with the results.
 * @param  {Object} touch
 * @return {Touch}
 */
function reconcileTouch(touch) {
  return Promise.resolve()
  .then(() => {
    if (touch.cheersId || touch.cardId) throw new Error('ALREADY_RECONCILED');
  })
  .then(() => db.sequelize.transaction(transaction =>
    createCheersFromTouch(touch, transaction)
    .then(({ card, cheers }) => {
      const cardId = card ? card.id : null;
      const cheersId = cheers ? cheers.id : null;

      return db.Touch.update({
        cardId,
        cheersId,
      }, {
        where: {
          id: touch.id,
        },
        transaction,
      });
    })))
    .then((numRowsUpdated) => {
      if (!numRowsUpdated) throw new Error('TOUCH_NOT_FOUND');
      return db.Touch.findById(touch.id).then(updatedTouch => updatedTouch.get());
    })
    .catch((error) => {
      // log and rethrow
      log.error(error);
      throw error;
    });
}


/**
 * Find all Touches where .kegId doesn't resolve to a Keg.
 * @return {Promise.Object[]}
 */
function getOrphanTouches() {
  return db.Touch.findAll({
    where: {
      '$Keg.id$': null,
    },
    include: [{
      model: db.Keg,
    }],
  });
}

/**
 * Find all Touches that don't have .cardId
 * @return {Promise.Object[]}
 */
function getUnreconciledTouches() {
  return db.Touch.findAll({
    where: {
      cardId: null,
    },
  });
}

module.exports = {
  getCard,
  getKeg,
  createCheersFromTouch,
  createTouch,
  createTouches,
  reconcileTouch,
  reconcileCardAndKeg,
  getOrphanTouches,
  getUnreconciledTouches,
};
