/**
 * BeerKegs
 * List of Kegs we've had for a given Beer.
 */

import React from 'react';

import { dayMonth } from '../../util/date';
import { beerModel } from '../../proptypes';

const BeerKegs = (props) => {
  const { Kegs } = props.beer;

  return (
    <div className="beer-kegs-list">
      <h3>Kegs</h3>

      {Kegs.length ? Kegs.map(keg => (
        <div>{dayMonth(keg.tapped)}</div>
      )) : 'Never had it'
      }
    </div>
  );
};

BeerKegs.propTypes = {
  beer: beerModel,
};

export default BeerKegs;
