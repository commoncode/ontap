/* eslint-disable no-console, padded-blocks */

/**
 * test/touches
 *
 * test suite for lib/touches
 */

require('dotenv-safe').load();
require('app-module-path').addPath(`${__dirname}/../`);

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

// enable should syntax and .eventually async test helper
chai.should();
chai.use(chaiAsPromised);

// use an in memory db
process.env.DB_STORAGE = ':memory:';
process.env.DB_DIALECT = 'sqlite';

const seeds = require('seed/seed');
const db = require('lib/db');
const touches = require('lib/touches');

// sync and seed before each test.
// if this becomes unperformant, use transactions intead.
beforeEach(() => db.sequelize.sync({ force: true })
  .then(() => seeds.seed()
));

describe('lib/touches', () => {

  describe('getCard()', () => {
    it('returns a card by uid', () =>
      touches.getCard(seeds.card.uid).should.eventually.be.an('object')
    );

    it('returns null for a bad uid', () =>
      touches.getCard('invalid uid').should.eventually.be.null
    );
  });

  describe('checkKeg()', () => {
    it('returns a boolean for keg existence', () =>
      touches.checkKeg(1).should.eventually.equal(true)
      .then(() =>
      touches.checkKeg(999).should.eventually.equal(false))
    );
  });

  describe('createTouch()', () => {
    it('creates a Touch and Cheers when cardUid and kegId can resolve', () => {
      // both point to valid models
      const cardUid = 'foobarqux';
      const kegId = 1;
      const timestamp = new Date();

      return touches.createTouch({
        cardUid,
        kegId,
        timestamp,
      })
      .then(() => db.Touch.findOne({
        where: {
          timestamp,
        },
      }))
      .then(touch => touch.get()).should.eventually.be.an('object')
      .which.includes({
        cardUid,
        kegId,
        cardId: 1, // sets cardId
        // timestamp,
      })
      .then(touch => db.Cheers.findById(touch.cheersId)) // sets cheersId
      .should.eventually.be.an('object')
      .which.includes({
        kegId,
        userId: 1, // this user owns card #1
        // timestamp,
      });
    });

    it('doesn\'t create Cheers if cardUid doesn\'t resolve', () => {
      const cardUid = 'invalid card uid';
      const kegId = 1; // valid
      const timestamp = new Date();

      let cheersCount;
      return db.Cheers.findAll().then((cheers) => {
        cheersCount = cheers.length;
      })
      .then(() => touches.createTouch({
        cardUid,
        kegId,
        timestamp,
      })
      .then(() => db.Touch.findOne({
        where: {
          timestamp,
        },
      }))
      .then(touch => touch.get()).should.eventually.be.an('object')
      .which.includes({
        cardUid, // gets set even though it can't resolve
        kegId,
        cardId: null, // card doesn't resolve yet,
        cheersId: null,
      })
      // shouldn't be any new cheers in the db
      .then(() => db.Cheers.findAll().should.eventually.be.an('array').of.length(cheersCount)));
    });

    it('doesn\'t create a Cheers if kegId doesn\'t resolve', () => {
      const cardUid = 'foobarqux'; // valid
      const kegId = 99; // invalid
      const timestamp = new Date();

      let cheersCount;
      return db.Cheers.findAll().then((cheers) => {
        cheersCount = cheers.length;
      })
      .then(() => touches.createTouch({
        cardUid,
        kegId,
        timestamp,
      })
      .then(() => db.Touch.findOne({
        where: {
          timestamp,
        },
      }))
      .then(touch => touch.get())
      .should.eventually.be.an('object')
      .which.includes({
        cardUid,
        kegId,
        cardId: 1, // Card should resolve
        cheersId: null, // no cheersId though
      })
      .then(() => db.Cheers.findAll().should.eventually.be.an('array').of.length(cheersCount)));
    });

    it('uses transaction so a failure prevents either model from being written', () => {
      // no idea how to do this actually...
    });
  });
});
