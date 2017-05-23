/**
 * KegListItem.
 *
 * Summary view of a Keg & Beer.
 */

import React from 'react';
import reactPropTypes from 'prop-types';
import * as propTypes from '../../proptypes';

import KegSummary from './keg-summary';
import BeerSummary from '../beers/beer-summary';

const KegListItem = (props) => {
  const { Beer, Tap } = props;
  const onTapClass = Tap ? 'on-tap' : '';

  return (
    <div className={`keg-list-item keg ${onTapClass}`}>
      { Tap && (
        <h2 className="tap-name">{Tap.name}</h2>
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
