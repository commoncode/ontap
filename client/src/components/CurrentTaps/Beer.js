import React from 'react';
import classnames from 'classnames/bind';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';

import styles from './current-taps.css';
import { dayMonth } from '../../util/date';


function calcStandardDrinks(abv, litres = 0.500) {
  // http://www.alcohol.gov.au/internet/alcohol/publishing.nsf/content/standard
  const ethanol = 0.789;
  const result = litres * abv * ethanol;
  return Math.round(result * 100) / 100;
}

const classes = classnames.bind(styles);

const Beer = ({ abv, beerName, breweryName, notes, standardDrinks, tapped }) =>
  <div className={classes(['beer'])}>
    <header>
      <div className={classes(['title'])}>
        <h2 className={classes(['beer-name'])}>
          {beerName}
        </h2>
        <h3 className={classes(['brewery-name'])}>
          {breweryName}
        </h3>
      </div>
      <div className={classes(['meta'])}>
        <p className={classes(['abv'])}>
          {`${abv}%`}
          <small className={classes(['std'])}>{` (${standardDrinks} SD)` } </small>
        </p>
        <p className={classes(['tapped'])}>
          Tapped {dayMonth(tapped)}
        </p>
      </div>

    </header>
    <p className={classes(['notes'])}>
      {notes}
    </p>
  </div>

const enhance = compose(
  withProps(({ abv }) => ({
    standardDrinks: calcStandardDrinks(abv),
  })),
);

export default enhance(Beer);
