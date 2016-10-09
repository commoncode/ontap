import React from 'react';
import branch from 'recompose/branch';
import classnames from 'classnames/bind';
import compose from 'recompose/compose';
import renderComponent from 'recompose/renderComponent';
import withProps from 'recompose/withProps';

import Beer from './Beer';
import styles from './current-taps.css';

const classes = classnames.bind(styles);

const Tap = ({ tap, ...props }) =>
  <article className={classes(['tap'])}>
    <div className={classes(['tap-name'])}>
      {tap}
    </div>
    <div className={classes(['beer'])}>
      <header>
        <Beer {...props} />
      </header>
    </div>
  </article>

const Dry = ({ tap }) =>
  <article className={classes(['tap', 'no-service'])}>
    <div className={classes(['tap-name'])}>
      {tap}
    </div>
    <div className={classes(['beer'])}>
      <header>
        <h2 className={classes(['beer-name'])}>No Service</h2>
      </header>
    </div>
  </article>

export default branch(
  props => !props.beerName,
  renderComponent(Dry),
  Component => Component
)(Tap);
