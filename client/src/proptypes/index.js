/**
 * Proptypes
 */

import React from 'react';

// error. todo.
export const error = React.PropTypes.object;

// sync object
export const sync = {
  fetching: React.PropTypes.boolean,
  fetched: React.PropTypes.boolean,
  error,
};

// keg model from the db
export const kegModel = {
  beerName: React.PropTypes.string,
  breweryName: React.PropTypes.string,
  tapped: React.PropTypes.string, // date?
  untapped: React.PropTypes.string, // date?
  notes: React.PropTypes.string,
};

// user model from the db
export const profileModel = {
  id: React.PropTypes.number,
  name: React.PropTypes.string,
  admin: React.PropTypes.boolean,
  avatar: React.PropTypes.string,
};

// profile with sync object & data
// todo - rename 'data' to 'model', like the others
// will mean updating the store
export const profile = Object.assign(sync, {
  data: profileModel,
});

// array of kegs
// sync, model and editing/syncing
// todo - move syncing into `sync`?
// or even just use fetching? i guess they're different.
export const kegs = React.PropTypes.arrayOf(
  React.PropTypes.shape(Object.assign(sync, {
    editing: React.PropTypes.boolean,
    syncing: React.PropTypes.boolean,
    model: kegModel,
  }))
);
