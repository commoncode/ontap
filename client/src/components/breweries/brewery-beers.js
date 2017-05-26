/**
 * BreweryBeers
 */

import React from 'react';
import propTypes from 'prop-types';

import { breweryModel, beerModel } from '../../proptypes';

const BreweryBeers = props => (
  <div className="brewery-beers">

    <h3 className="list-title">Beers by {props.Brewery.name}</h3>

    {!props.Beers.length && (
      <p>We haven't got any beers by this brewery. Add one?</p>
    )}

    <div className="single-line-list">
      {props.Beers.map(beer => (
        <div className="list-item" key={beer.id}>
          <div className="column">
            <a href={`/#/beers/${beer.id}/`}><b>{beer.name}</b></a>
          </div>
          <div className="column">
            {beer.variety}
          </div>
          <div className="column">
            {beer.abv && `${beer.abv}% ABV`}
          </div>
        </div>
      ))}
    </div>
  </div>
);

BreweryBeers.propTypes = {
  Brewery: propTypes.shape(breweryModel),
  Beers: propTypes.arrayOf(propTypes.shape(beerModel)),
};

export default BreweryBeers;
