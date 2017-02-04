/**
 * Keg.
 */

import React from 'react';
import classnames from 'classnames/bind';

import styles from '../taps/taps.css';

import * as propTypes from '../../proptypes';


import KegSummary from './keg-summary';
import BeerSummary from '../beers/beer-summary';

const classes = classnames.bind(styles);

const Keg = (props) => {
  const { Beer, Tap } = props;
  const onTapClass = Tap ? 'on-tap' : '';

  return (
    <div className={`keg ${classes(['keg', onTapClass])}`}>
      <BeerSummary {...Beer} />
      <KegSummary {...props} />
    </div>
  );
};

Keg.propTypes = {
  Tap: propTypes.tapModel,
  Beer: propTypes.beerModel,
};

export default Keg;
