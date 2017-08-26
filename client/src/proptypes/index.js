/**
 * PropTypes shapes for our models and commonly used patterns.
 */

import propTypes from 'prop-types';

// error, todo...
export const error = propTypes.object;


// sync object
export const sync = {
  fetching: propTypes.bool,
  fetched: propTypes.bool,
  pushing: propTypes.bool,
  error,
};


export const userModel = {
  id: propTypes.number,
  name: propTypes.string,
  admin: propTypes.bool,
  avatar: propTypes.string,
  email: propTypes.string,
};

// note - Keg added below kegModel
export const cheersModel = {
  id: propTypes.number,
  kegId: propTypes.number,
  userId: propTypes.number,
  timestamp: propTypes.string,
};

export const beerModel = {
  id: propTypes.number,
  name: propTypes.string,
  abv: propTypes.number,
  ibu: propTypes.number,
  variety: propTypes.string,
  notes: propTypes.string,
  canBuy: propTypes.bool,
};

export const kegModel = {
  abv: propTypes.number,
  notes: propTypes.string,
  tapped: propTypes.string,
  untapped: propTypes.string,
  Beer: propTypes.shape(beerModel),
  Cheers: propTypes.arrayOf(propTypes.shape(cheersModel)),
};

// have to add this here to avoid circular deps
cheersModel.Keg = propTypes.shape(kegModel);

export const breweryModel = {
  id: propTypes.number,
  name: propTypes.string,
  location: propTypes.string,
  description: propTypes.string,
  adminNotes: propTypes.string,
  canBuy: propTypes.bool,
};

export const tapModel = {
  id: propTypes.number,
  name: propTypes.string,
  kegId: propTypes.number,
  Keg: propTypes.shape(kegModel),
};

export const cardModel = {
  id: propTypes.number,
  uid: propTypes.string,
  userId: propTypes.number,
  name: propTypes.string,
};

// notification
export const notificationModel = propTypes.shape({
  message: propTypes.string,
});


// profile with sync object & data
// todo - rename 'data' to 'model', like the others
// will mean updating the store
export const profile = {
  ...sync,
  data: propTypes.shape(userModel),
};


// keg with a sync object and editing/syncing props
// todo - fold editing/syncing into the sync object?
// maybe just syncing.
export const keg = {
  ...sync,
  model: kegModel,
};

// tap with a sync object and editing/syncing props
// todo - fold editing/syncing into sync object? see above.
export const tap = {
  ...sync,
  editing: propTypes.bool,
  syncing: propTypes.bool,
  model: tapModel,
};
