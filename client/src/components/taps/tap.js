/**
 * Tap.
 * Displays a Tap, and if the Tap has a Keg, we'll show that too.
 */

import React from 'react';
import branch from 'recompose/branch';
import classnames from 'classnames/bind';
import renderComponent from 'recompose/renderComponent';

import * as propTypes from '../../proptypes/';
import { dayMonth } from '../../util/date';

import styles from './taps.css';

const classes = classnames.bind(styles);

const Tap = (props) => {
  const { model, profile } = props;
  const { name, id, Keg } = model;
  const { Beer } = Keg;
  return (
    <article className={`${classes(['tap'])}`}>
      <div className={classes(['tap-name'])}>
        {name}
      </div>
      <div className={classes(['tap-keg'])}>
        <h2 className={classes(['beer-name'])}>{Beer.breweryName } - {Beer.name}</h2>
        <p className={classes(['tapped-date'])}>Tapped {dayMonth(Keg.tapped)}</p>
      </div>

      {profile && profile.admin &&
        <div className={classes(['tap-admin'])}>
          <a href={`/#/taps/${id}/`}>Change Tap</a>
        </div>
      }
    </article>
  );
};

Tap.propTypes = {
  model: propTypes.kegModel,
  profile: propTypes.profile,
};

const Dry = props => (
  <article className={classes(['tap', 'no-service'])}>
    <div className={classes(['tap-name'])}>
      {props.model.name}
    </div>
    <div className={classes(['tap-keg'])}>
      <header>
        <h2 className={classes(['beer-name'])}>No Service</h2>
      </header>
    </div>
    {props.profile && props.profile.admin &&
      <div className={classes(['tap-admin'])}>
        <a href={`/#/taps/${props.model.id}/`}>Change Tap</a>
      </div>
    }
  </article>
);

Dry.propTypes = {
  model: propTypes.kegModel,
  profile: propTypes.profile,
};

// switch Dry/Tap based on whether there's a Keg
export default branch(
  props => !props.model.Keg,
  renderComponent(Dry),
  Component => Component
)(Tap);
