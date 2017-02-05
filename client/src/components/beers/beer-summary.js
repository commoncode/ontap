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

import Avatar from '../generic/avatar';

const BeerSummary = props => (
  <div className="beer-summary-view">
    <div className="primary">
      <h1 className="name">
        <a href={`/#/beers/${props.id}/`}>{props.name}</a>
      </h1>
      <h2 className="brewery-name">{props.breweryName}</h2>
      <h4 className="variety">{props.variety}</h4>
      {!props.canBuy && <p className="unavailable">This beer is unavailable for order.</p> }
      <p className="notes">{props.notes}</p>
    </div>

    <div className="meta">
      <p className="abv">{props.abv ? `${props.abv}%` : '?'} ABV</p>
      <p className="ibu">{props.ibu ? props.ibu : '?'} IBU</p>
      {props.abv && <p className="sd">
        {props.standardDrinks } SD / pint
      </p> }
      { props.addedByUser &&
        <Avatar {...props.addedByUser} size="40" />
      }
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
