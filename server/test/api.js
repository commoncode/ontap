/**
 * test/api
 *
 * test the API endpoints with supertest.
 * tests the routes/api module by loading it into an
 * express server and firing actual requests to it.
 *
 * todo - generate some seed data? until then run things
 * in order, i guess.
 */

require('dotenv').config();
require('app-module-path').addPath(`${__dirname}/../`);

// use memory-based sqlite so it's fresh each time
process.env.DB_STORAGE = ':memory:';
process.env.DB_DIALECT = 'sqlite';

const supertest = require('supertest');
const express = require('express');
const { expect } = require('chai');

const apiRoutes = require('routes/api');

const testapp = express();
testapp.use('/', apiRoutes);
const api = supertest(testapp);

describe('/api/v1', () => {
  describe('/helloworld', () => {
    it('responds', (done) => {
      api.get('/helloworld')
      .expect(200, done);
    });
  });

  describe('/ontap', () => {
    it('responds with JSON', (done) => {
      api.get('/ontap')
      .expect('Content-Type', /json/)
      .expect(200, done);
    });
  });

  describe('/GET beers', () => {
    it('is empty', (done) => {
      api.get('/beers')
      .expect((res) => {
        expect(res.body.length).to.equal(0);
      })
      .end(done);
    });
  });

  describe('POST /beers', () => {
    it('accepts JSON', (done) => {
      api.post('/beers')
      .send({
        beerName: 'delicious brew',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).to.contain({
          beerName: 'delicious brew',
        });
      })
      .end(done);
    });
  });

  describe('GET /beers/1', () => {
    it('should gimme my last beer', (done) => {
      api.get('/beers/1')
      .expect(200, done);
    });
  });

  describe('GET /beers/xyz', () => {
    it('should 404', (done) => {
      api.get('/beers/12')
      .expect(404, done);
    });
  });

  describe('/GET beers', () => {
    it('works', (done) => {
      api.get('/beers')
      .expect((res) => {
        expect(res.body.length).to.equal(1);
      })
      .end(done);
    });
  });
});
