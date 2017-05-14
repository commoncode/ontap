/* eslint-disable no-console */

/**
 * bin/db
 *
 * load the db module and run a REPL.
 * handy for when you just want to tool around
 * with the db methods.
 */

const path = require('path');
const repl = require('repl');

// needs same config as index.js
require('dotenv-safe').load();
require('app-module-path').addPath(path.join(__dirname, '../'));


const db = require('lib/db.js');
const seed = require('seed/seed');

const r = repl.start('> ');


// set a user's admin flag to true, by passing their pk
function makeAdmin(id) {
  return db.User.update({
    admin: true,
  }, {
    where: {
      id,
    },
  }).then(updated => console.log(updated));
}

// prints the result of a .findAll() to the console
function printRows(rows) {
  return console.log(rows.map(row => row.get()));
}

// print the result of a .query() to the console
function printQuery(result) {
  return console.log(result[0]);
}

// add context to the REPL
r.context = Object.assign(r.context, {
  db,
  makeAdmin,
  seed,
  printRows,
  printQuery,
});
