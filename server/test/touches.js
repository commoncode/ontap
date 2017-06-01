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
const omit = require('lodash/omit');

// enable should syntax and .eventually async test helper
const { expect } = chai;
chai.should();
chai.use(chaiAsPromised);

// use an in memory db
process.env.DB_STORAGE = ':memory:';
process.env.DB_DIALECT = 'sqlite';

const seeds = require('seed/seed');
const db = require('lib/db');
const touches = require('lib/touches');


// return an object with timestamp keys omitted.
// equality assertions fail because of them.
// todo - figure out why.
function stripTimestamps(obj, extraKeys = []) {
  return omit(obj, ['updatedAt', 'createdAt', 'timestamp', ...extraKeys]);
}

// reloads and gets values from a model.
// the test below explains why it's needed.
function getValues(model) {
  return model.reload().then(reloadedModel => reloadedModel.get());
}

// sync and seed before each test.
// if this becomes unperformant, use transactions intead.
beforeEach(() => db.sequelize.sync({ force: true })
  .then(() => seeds.seed()
));

describe('test/touches', () => {
  // for some reason model.create() doesn't return any columns that
  // should have a value of null.
  // pipe it through getValues to return all columns.
  describe('getValues()', () => {
    it('ensures columns that default to null are returned', () =>
      db.Touch.create({
        cardUid: 'something',
        timestamp: new Date(),
        kegId: 1,
        cheersId: null,
      })
      .then((touch) => {
        // cardId and cheersId are both nullable with no defaultValue
        // so they don't get returned here.
        touch.should.not.include({
          cardId: null,
          cheersId: null,
        });
        return touch;
      })
      .then(getValues)
      .then((touch) => {
        // and now they do
        touch.should.include({
          cardId: null,
          cheersId: null,
        });
      })
    );
  });
});

describe('lib/touches', () => {

  describe('getCard()', () => {
    it('returns a card by uid, fallback to null', () =>
      touches.getCard(seeds.card.uid).should.eventually.be.an('object').that.includes(seeds.card)
      .then(() =>
      touches.getCard(99999).should.eventually.equal(null)));
  });

  describe('getKeg()', () => {
    it('returns a keg by id, fallback to null', () =>
      touches.getKeg(seeds.keg.id).should.eventually.be.an('object').that.includes(seeds.keg)
      .then(() =>
      touches.getKeg(999).should.eventually.equal(null))
    );
  });

  describe('reconcileCardAndKeg()', () => {
    it('returns models if reconciled', () =>
      touches.reconcileCardAndKeg({
        cardUid: seeds.card.uid,
        kegId: seeds.keg.id,
      })
      .then((obj) => {
        obj.card.should.be.an('object').that.includes(seeds.card);
        obj.keg.should.be.an('object').that.includes(seeds.keg);
      }));

    it('returns nulls if not reconciled', () =>
      touches.reconcileCardAndKeg({
        cardUid: 999999,
        kegId: 999999,
      })
      .should.eventually.be.an('object').that.includes({
        card: null,
        keg: null,
      }));
  });


  describe('createCheersFromTouch', () => {
    it('creates a Cheers if cardUid and kegId can be reconciled', () => {
      const validTouch = {
        cardUid: seeds.card.uid,
        kegId: seeds.keg.id,
        timestamp: new Date(),
      };

      return db.Cheers.count()
      .then(numCheers => touches.createCheersFromTouch(validTouch)
        .then((response) => {
          response.card.should.be.an('object').that.includes(seeds.card);
          response.keg.should.be.an('object').that.includes(seeds.keg);
          response.cheers.should.be.an('object').that.includes({
            kegId: seeds.keg.id,
            userId: seeds.card.userId,
          });
        })
        .then(() => db.Cheers.count())
        .then(numCheersNow => numCheersNow.should.equal(numCheers + 1))
      );
    });

    it('doesn\'t create a Cheers if cardUid can\'t be reconciled', () => {
      const badCardUid = {
        cardUid: 'invalid card uid',
        kegId: seeds.keg.id,
        timestamp: new Date(),
      };

      return db.Cheers.count()
      .then(numCheers => touches.createCheersFromTouch(badCardUid)
        .then(response => response.should.include({
          cheers: null,
        }))
        .then(() => db.Cheers.count())
        .then(numCheersNow => numCheersNow.should.equal(numCheers))
      );
    });

    it('doesn\'t create a Cheers if kegId can\'t be reconciled', () => {
      const badKegId = {
        cardUid: seeds.card.uid,
        kegId: 9999999,
        timestamp: new Date(),
      };

      return db.Cheers.count()
      .then(numCheers => touches.createCheersFromTouch(badKegId)
        .then(response => response.should.include({
          cheers: null,
        }))
        .then(() => db.Cheers.count())
        .then(numCheersNow => numCheersNow.should.equal(numCheers))
      );
    });

    it('doesn\'t create a Cheers if kegId and cardUid can\'t be reconciled', () => {
      const invalid = {
        cardUid: 'invalid card uid',
        kegId: 9999999,
        timestamp: new Date(),
      };

      return db.Cheers.count()
      .then(numCheers => touches.createCheersFromTouch(invalid)
        .then(response => response.should.include({
          cheers: null,
        }))
        .then(() => db.Cheers.count())
        .then(numCheersNow => numCheersNow.should.equal(numCheers))
      );
    });

    xit('supports transactions', () => {
      // todo - figure this out
    });
  });

  describe('createTouch()', () => {
    it('creates a Touch and when cardUid and kegId can resolve', () => {
      const cardUid = seeds.card.uid;
      const kegId = seeds.keg.id;
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
        cardId: seeds.card.id,
      })
      // this is tested above by createCheersFromTouch but hey why not
      .then(touch => db.Cheers.findById(touch.cheersId))
      .should.eventually.be.an('object')
      .which.includes({
        kegId,
        userId: seeds.card.userId,
      });
    });

    xit('uses transaction so a failure prevents either model from being written', () => {
      // todo - figure out how to test this?
      // make the Touch insert fail and check the Cheers wasn't inserted.
    });
  });

  describe('createTouches()', () => {
    it('processes an array of touches through createTouch()', () => {

      const cardUid = seeds.card.uid;
      const kegId = seeds.keg.id;
      const timestamp = new Date();

      const t1 = {
        cardUid,
        kegId,
        timestamp,
      };

      const t2 = {
        cardUid: 'different card uid who cares',
        kegId,
        timestamp,
      };

      const t3 = {
        cardUid,
        kegId: 9999,
        timestamp,
      };

      const propsArray = [t1, t2, t3];

      // count current touches
      return db.Touch.count()
      .then(numTouches =>
        touches.createTouches(propsArray)
        // returns an array with 3 elements
        .should.eventually.be.an('array').of.length('3')
        .then((touchArray) => {
          // same order we put them in, with the right props
          touchArray.forEach((touch, i) => {
            touch.should.be.an('object').that.includes(propsArray[i]);
          });
          return touchArray;
        })
        // and now there's +3 in the db
        .then(() => db.Touch.count())
        .should.eventually.equal(numTouches + 3)
      );
    });
  });


  describe('reconcileTouch()', () => {
    it('throws if the Touch is already reconciled', () =>
      // createTouch will reconcile by itself
      touches.createTouch({
        cardUid: seeds.card.uid,
        kegId: seeds.keg.id,
        timestamp: new Date(),
      })
      .then(touch => touches.reconcileTouch(touch))
      .should.be.rejectedWith(Error, 'ALREADY_RECONCILED'));

    it('does nothing if Card can\'t be reconciled', () =>
      db.Touch.create({
        cardUid: 'INVALID CARD UID',
        kegId: seeds.keg.id,
        timestamp: new Date(),
      })
      .then(touch => touch.get())
      .then(touch => touches.reconcileTouch(touch)
        .then((reconciledTouch) => {
          // should all be the same
          reconciledTouch.should.include(stripTimestamps(touch));
        })
      ));

    it('sets Touch.cardId but doesn\'t create Cheers if kegId is bad', () =>
      db.Cheers.count()
      .then(numCheers =>
        db.Touch.create({
          cardUid: seeds.card.uid,
          kegId: 99999,
          timestamp: new Date(),
        })
        .then(touch => touch.get())
        .then(touch => touches.reconcileTouch(touch)
          .then((reconciledTouch) => {
            reconciledTouch.should.include(Object.assign(stripTimestamps(touch), {
              cardId: seeds.card.id,
            }));
          })
        )
        .then(() => db.Cheers.count())
        .then(numCheersNow => numCheersNow.should.equal(numCheers))
      )
    );

    it('creates a Cheers if Card and Keg are both reconciled', () =>
      db.Cheers.count()
      .then(numCheers =>
        db.Touch.create({
          cardUid: seeds.card.uid,
          kegId: seeds.keg.id,
          timestamp: new Date(),
        })
        .then(getValues)
        .then((touch) => {
          // no cardId, cheersId
          expect(touch.cardId).to.equal(null);
          expect(touch.cheersId).to.equal(null);
          return touch;
        })
        .then(touch => touches.reconcileTouch(touch)
          .then((reconciledTouch) => {
            // both were reconciled so we've got a cheers
            reconciledTouch.cardId.should.equal(seeds.card.id);
            reconciledTouch.cheersId.should.not.equal(null);

            // and we created a cheers
            return db.Cheers.findById(reconciledTouch.cheersId);
          })
        )
        .should.eventually.be.an('object').that.includes({
          userId: seeds.card.userId,
          kegId: seeds.keg.id,
        })
        .then(() => db.Cheers.count())
        .then(cheersCountNow => cheersCountNow.should.equal(numCheers + 1))
      )
    );

  });

  describe('reconcileTouches()', () => {
    it('Processes an array of Touches and returns reconciled Touches', () => {

      // - a valid touch
      // - touch with unknown cardUid
      // - touch with unknown kegId
      // - a valid touch
      // we should get 2 back, and it should create 2 cheers.

      return db.Cheers.count()
      .then((numCheers) => {
        const touchArray = [];

        return db.Touch.create({
          cardUid: seeds.card.uid,
          kegId: seeds.keg.id,
          timestamp: new Date(),
        })
        .then(touch => touchArray.push(touch))
        .then(() => db.Touch.create({
          cardUid: 'invalid card uid',
          kegId: seeds.keg.id,
          timestamp: new Date(),
        }))
        .then(touch => touchArray.push(touch))
        .then(() => db.Touch.create({
          cardUid: seeds.card.uid,
          kegId: 99999,
          timestamp: new Date(),
        }))
        .then(touch => touchArray.push(touch))
        .then(() => db.Touch.create({
          cardUid: seeds.card.uid,
          kegId: seeds.keg.id,
          timestamp: new Date(),
        }))
        .then(touch => touchArray.push(touch))
        .then(() => touches.reconcileTouches(touchArray))
        .should.eventually.be.an('array').of.length(2)
        .then(response => response[0].should.be.an('object').and.include({
          cardUid: seeds.card.uid,
          cardId: seeds.card.id,
          kegId: seeds.keg.id,
        }))
        .then(() => db.Cheers.count())
        .then(cheersCountNow => cheersCountNow.should.equal(numCheers + 2));
      });


    });
  });

  describe('a user can touch before registering a card and then claim the cheers', () => {
    // I think technically this all covered above, but since it's the
    // whole point of the thing we'll go through it from start to finish...

    const cardUid = 'a fake card uid';
    const kegId = 1;
    const timestamp = new Date();
    const randomUser = {
      name: 'Some random',
      googleProfileId: 'fakeProfileId',
      email: 'some@random.com',
    };

    it('works', () =>
      // create touches from some random with an unknown cardUid
      touches.createTouches([{
        cardUid,
        kegId,
        timestamp,
      }, {
        cardUid,
        kegId,
        timestamp,
      }])
      // now the random registers an account
      .then(() => db.User.create(randomUser))
      // and claims the card
      .then(user => db.Card.create({
        userId: user.id,
        uid: cardUid,
        name: 'My security token',
      }))
      // now we reconcile the touch...
      .then(() => touches.getUnreconciledTouches(cardUid))
      .then(unreconciledTouches => touches.reconcileTouches(unreconciledTouches))
      // and look up our random user
      .then(() => db.User.findOne({
        where: {
          email: randomUser.email,
        },
        include: db.Cheers,
      }))
      // and he's got 2 cheers!
      .then((user) => {
        user.Cheers.should.be.an('array').of.length(2);
        user.Cheers[0].kegId.should.equal(kegId);
      })
    );

  });

  describe('getOrphanTouches()', () => {
    it('returns Touches where .kegId doesn\'t reconcile', () => {
      const cardUid = seeds.card.uid;
      const kegId = seeds.keg.id;
      const timestamp = new Date();

      // 4 touches, 2 with bad kegId
      return touches.createTouches([{
        cardUid,
        kegId,
        timestamp,
      }, {
        cardUid: 'invalid card uid',
        kegId,
        timestamp,
      }, {
        cardUid: 'invalid card uid',
        kegId: 50000,
        timestamp,
      }, {
        cardUid,
        kegId: 50000,
        timestamp,
      }])
      .then(() => touches.getOrphanTouches())
      .should.eventually.be.an('array').of.length(2);
    });
  });

  describe('getUnreconciledTouches()', () => {
    it('returns Touches without a .cardId', () => {
      const cardUid = seeds.card.uid;
      const kegId = seeds.keg.id;
      const timestamp = new Date();

      // 4 touches, 2 with bad cardId
      return touches.createTouches([{
        cardUid,
        kegId,
        timestamp,
      }, {
        cardUid: 'invalid card uid',
        kegId,
        timestamp,
      }, {
        cardUid,
        kegId: 9999,
        timestamp,
      }, {
        cardUid: 'invalid card uid',
        kegId: 9999,
        timestamp,
      }])
      .then(() => touches.getUnreconciledTouches())
      .should.eventually.be.an('array').of.length(2);
    });

    it('optionally takes a cardUid argument to filter by', () => {
      const kegId = seeds.keg.id;
      const timestamp = new Date();

      // create 2 unreconcileable touches
      return touches.createTouches([{
        cardUid: 'abc',
        kegId,
        timestamp,
      }, {
        cardUid: 'abc',
        kegId,
        timestamp,
      }, {
        cardUid: 'def',
        kegId,
        timestamp,
      }, {
        cardUid: 'def',
        kegId,
        timestamp,
      }])
      .then(() => touches.getUnreconciledTouches('abc'))
      .should.eventually.be.an('array').of.length(2);
    });
  });

});
