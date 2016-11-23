import React from 'react';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

import Smiley from '../generic/smiley';


const Rating = props => (
  <div className="rating">
    <Smiley value={props.value} />
    &nbsp;
    <a href={`/#/kegs/${props.Keg.id}/`}>
      {props.Keg.beerName} ({props.Keg.breweryName})
    </a>
  </div>
);


export default (props) => {

  const firstName = props.name.split(' ')[0];

  const sortedRatings = sortBy(props.Ratings, 'value').reverse();

  return (
    <div>
      <header>
        <h2>{props.name}</h2>
        <img className="avatar" src={`${props.avatar}?size=110`} />
      </header>

      <section className="user-detail-ratings">
        {!sortedRatings.length &&
          <div>{firstName} hasn't rated any beers yet...</div>
        }

        {sortedRatings.map(rating => <Rating key={rating.id} {...rating} />)}

      </section>
    </div>
  );
};
