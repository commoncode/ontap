/**
 * Proptypes
 */

import React from 'react';

export const kegModel = {
  beerName: React.PropTypes.string,
  breweryName: React.PropTypes.string,
  tapped: React.PropTypes.string, // date?
  untapped: React.PropTypes.string, // date?
  notes: React.PropTypes.string,
};
