/**
 * BeerListItem.
 *
 * Single beer in the list.
 */

import React from 'react';

const BeerListItem = (props) => {
  const beer = props;
  const { Brewery } = beer;

  return (
    <div className="beer-list-item">
      <header>
        <h4 className="beer-name">
          <a href={`/#/beers/${beer.id}/`}>{beer.name || '?'}</a>
        </h4>
        <h5 className="variety-by-brewery">
          <span>{beer.variety}</span> by <span><a href={`/#/breweries/${Brewery.id}/`}>{Brewery.name}</a></span>
        </h5>
      </header>
      <div className="meta">
        {beer.abv && <span className="abv">{beer.abv}% ABV</span>}
        {beer.ibu && <span className="ibu">{beer.ibu} IBU</span>}
      </div>
    </div>
  );
};

export default BeerListItem;
