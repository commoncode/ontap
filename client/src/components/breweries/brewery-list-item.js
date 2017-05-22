/**
 * BreweryListItem
 *
 */

import React from 'react';

import { breweryModel } from '../../proptypes';

const BreweryListItem = props => (
  <div className="brewery-list-item">
    <header>
      <h4 className="name"><a href={`/#/breweries/${props.id}`}>{props.name}</a></h4>
      <h5 className="location">{props.location}</h5>
    </header>
  </div>
);

BreweryListItem.propTypes = breweryModel;

export default BreweryListItem;
