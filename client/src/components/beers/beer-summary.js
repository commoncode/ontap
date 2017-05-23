/**
 * BeerSummary
 * Quick overview of a beer;
 * name, brewery, ABV, IBU, etc. just the basics.
 */

import React from 'react';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';

import { beerModel } from '../../proptypes';
import { calcStandardDrinks } from '../../util/util';

const BeerSummary = props => (
  <div className="beer-summary-view">
    <div className="primary">
      <h1 className="beer-name">
        {props.kegId && (
          <span>{`Keg #${props.kegId}: `}</span>
        )}
        <a href={`/#/beers/${props.id}/`}>{props.name}</a>
      </h1>
      <h2 className="variety-by-brewery">
        {props.variety && `${props.variety} `}
        by <a className="link-brewery" href={`/#/breweries/${props.Brewery.id}/`}>{props.Brewery.name}</a>
        {props.canBuy && <icon className="icon-canbuy emoji-tick" title="We can order kegs of this beer" />}
      </h2>

      {(props.abv || props.ibu) && (
        <div className="meta">
          <p className="abv">{props.abv ? `${props.abv}%` : '?'} ABV <span className="sd">({props.standardDrinks} sd / pint)</span></p>
          <p className="ibu">{props.ibu ? props.ibu : '?'} IBU</p>
        </div>
      )}

      <p className="notes">{props.notes}</p>
    </div>
  </div>
);

BeerSummary.propTypes = beerModel;

const enhance = compose(
  withProps(props => ({
    standardDrinks: calcStandardDrinks(props.abv),
  })),
);
export default enhance(BeerSummary);
