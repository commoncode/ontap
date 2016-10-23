import React from 'react';
import branch from 'recompose/branch';
import classnames from 'classnames/bind';
import renderComponent from 'recompose/renderComponent';

import Keg from './Keg';
import styles from './current-taps.css';

const classes = classnames.bind(styles);

const Tap = ({ name, ...props }) => (
  <article className={`tap ${classes(['tap'])}`}>
    <div className={classes(['tap-name'])}>
      {name}
    </div>
    <div className={classes(['keg'])}>
      <header>
        <Keg {...props.Keg} />
      </header>
    </div>
  </article>
);

Tap.propTypes = {
  name: React.PropTypes.string,
  Keg: React.PropTypes.object,
};

const Dry = ({ name }) => (
  <article className={classes(['tap', 'no-service'])}>
    <div className={classes(['tap-name'])}>
      {name}
    </div>
    <div className={classes(['keg'])}>
      <header>
        <h2 className={classes(['beer-name'])}>No Service</h2>
      </header>
    </div>
  </article>
);

Dry.propTypes = {
  name: React.PropTypes.string,
};

export default branch(
  props => !props.Keg,
  renderComponent(Dry),
  Component => Component
)(Tap);
