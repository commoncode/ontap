/**
 * KegListItem.
 *
 * Summary view of a Keg & Beer.
 */

import React from 'react';
import reactPropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from '../taps/taps.css';

import * as propTypes from '../../proptypes';

import KegSummary from './keg-summary';
import BeerSummary from '../beers/beer-summary';

const classes = classnames.bind(styles);

const KegListItem = (props) => {
  const { Beer, Tap } = props;
  const onTapClass = Tap ? 'on-tap' : '';

  return (
    <div className={`keg-list-item ${classes(['keg', onTapClass])}`}>
      { Tap && (
        <p className="tap-name">{Tap.name}</p>
      )}
      <BeerSummary {...Beer} />
      <KegSummary {...props} />
    </div>
  );
};

KegListItem.propTypes = {
  Tap: reactPropTypes.shape(propTypes.tapModel),
  Beer: reactPropTypes.shape(propTypes.beerModel),
};

export default KegListItem;
