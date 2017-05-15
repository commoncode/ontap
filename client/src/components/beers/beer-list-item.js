/**
 * BeerListItem.
 *
 * Single beer in the list.
 */

import React from 'react';

const BeerListItem = (props) => {
  const beer = props;

  return (
    <div className={`beer-list-item ${beer.canBuy ? 'available' : 'unavailable'}`}>
      <header>
        <h4 className="name">
          <a href={`/#/beers/${beer.id}/`}>{beer.name || 'unnamed'}</a>
          &nbsp;
          {beer.Brewery && <span>({beer.Brewery.name})</span>}
        </h4>
        {beer.variety && <h5 className="variety">{beer.variety}</h5>}
      </header>
      <div className="meta">
        {beer.abv && <span>{beer.abv}% ABV</span>}
        {beer.ibu && <span>{beer.ibu} IBU</span>}
      </div>
    </div>
  );
};

export default BeerListItem;
