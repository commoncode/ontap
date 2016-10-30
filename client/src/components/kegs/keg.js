/**
 * Keg.
 * Pure render component to display a Keg model.
 */

import React from 'react';
import classnames from 'classnames/bind';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';

import styles from '../taps/taps.css';
import { dayMonth } from '../../util/date';

const classes = classnames.bind(styles);

const Keg = (props) => {
  const { id, standardDrinks, abv, beerName, breweryName, notes, tapped } = props;

  return (
    <div className={`keg ${classes(['keg'])}`}>
      <header>
        <div className={classes(['title'])}>
          <h2 className={classes(['beer-name'])}>
            <a href={`/#/kegs/${id}`}>{beerName}</a>
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
            {tapped && `Tapped ${dayMonth(tapped)}`}
          </p>
        </div>

      </header>
      <p className={classes(['notes'])}>
        {notes}
      </p>
    </div>
  );
};

Keg.propTypes = {
  id: React.PropTypes.number,
  standardDrinks: React.PropTypes.number,
  abv: React.PropTypes.number,
  beerName: React.PropTypes.string,
  breweryName: React.PropTypes.string,
  notes: React.PropTypes.string,
  tapped: React.PropTypes.string,
};

function calcStandardDrinks(abv, litres = 0.500) {
  // http://www.alcohol.gov.au/internet/alcohol/publishing.nsf/content/standard
  const ethanol = 0.789;
  const result = litres * abv * ethanol;
  return Math.round(result * 100) / 100;
}

const enhance = compose(
  withProps(props => ({
    standardDrinks: calcStandardDrinks(props.abv),
  })),
);

export default enhance(Keg);
