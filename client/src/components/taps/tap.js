/**
 * Tap.
 * Displays a Tap, and if the Tap has a Keg, we'll show that too.
 */

import React from 'react';
import branch from 'recompose/branch';
import classnames from 'classnames/bind';
import renderComponent from 'recompose/renderComponent';

import * as propTypes from '../../proptypes/';

import Keg from '../kegs/keg';
import styles from './taps.css';

const classes = classnames.bind(styles);

const Tap = (props) => {
  const { model, profile } = props;
  const { name } = model;
  return (
    <article className={`tap ${classes(['tap'])}`}>
      <div className={classes(['tap-name'])}>
        {profile && profile.admin &&
          <a href={`/#/taps/${model.id}`}>{name}</a>
        }
        {!profile || !profile.admin && name }
      </div>
      <div className={classes(['keg'])}>
        <header>
          <Keg {...model.Keg} />
        </header>
      </div>
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
      {props.profile && props.profile.admin &&
          <a href={`/#/taps/${props.model.id}`}>{props.model.name}</a>
        }
        {!props.profile || !props.profile.admin && props.model.name }
    </div>
    <div className={classes(['keg'])}>
      <header>
        <h2 className={classes(['beer-name'])}>No Service</h2>
      </header>
    </div>
  </article>
);

Dry.propTypes = {
  model: propTypes.kegModel,
};

// switch Dry/Tap based on whether there's a Keg
export default branch(
  props => !props.model.Keg,
  renderComponent(Dry),
  Component => Component
)(Tap);
