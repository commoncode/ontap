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
require('dotenv').config();
require('app-module-path').addPath(path.join(__dirname, '../'));


const db = require('lib/db.js');

const r = repl.start('> ');


// add .db to the REPL context
r.context = Object.assign(r.context, {
  db,
});
