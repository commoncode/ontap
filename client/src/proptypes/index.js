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

// profile model from the API.
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

// keg model from the API.
export const kegModel = React.PropTypes.shape({
  beerName: React.PropTypes.string,
  breweryName: React.PropTypes.string,
  tapped: React.PropTypes.string, // date?
  untapped: React.PropTypes.string, // date?
  notes: React.PropTypes.string,
});

// keg with a sync object and editing/syncing props
// todo - fold editing/syncing into the sync object?
// maybe just syncing.
export const keg = React.PropTypes.shape(Object.assign(sync, {
  editing: React.PropTypes.boolean,
  syncing: React.PropTypes.boolean,
  model: kegModel,
}));

// array of kegs
export const kegs = React.PropTypes.arrayOf(keg);

// tap model from the API
export const tapModel = React.PropTypes.shape({
  id: React.PropTypes.number,
  name: React.PropTypes.string,
  kegId: React.PropTypes.number,
  Keg: kegModel,
});

// tap with a sync object and editing/syncing props
// todo - fold editing/syncing into sync object? see above.
export const tap = React.PropTypes.shape(Object.assign(sync, {
  editing: React.PropTypes.boolean,
  syncing: React.PropTypes.boolean,
  model: tapModel,
}));

// array of taps
export const taps = React.PropTypes.arrayOf(tap);
