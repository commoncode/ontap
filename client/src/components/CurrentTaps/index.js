import React from 'react';
import classnames from 'classnames/bind';

import Tap from './Tap';
import styles from './current-taps.css';


const classes = classnames.bind(styles);

const CurrentTapsComponent = props => (
  <section className={classes(['on-tap-list'])}>
    { props.taps.map(tap => <Tap key={tap.id} {...tap} />) }
  </section>
);

CurrentTapsComponent.propTypes = {
  taps: React.PropTypes.array,
};

export default CurrentTapsComponent;
