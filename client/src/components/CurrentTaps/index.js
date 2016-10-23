import React from 'react';
import classnames from 'classnames/bind';

import Loader from '../Loader';

import Tap from './Tap';
import styles from './current-taps.css';

const classes = classnames.bind(styles);

const CurrentTapsComponent = props => (
  <section className={classes(['on-tap-list'])}>
    {props.taps.fetching && <Loader />}

    {props.taps.fetched &&
      props.taps.data.map(tap => <Tap key={tap.id} {...tap} />)
    }
  </section>
);

CurrentTapsComponent.propTypes = {
  taps: React.PropTypes.array,
};

export default CurrentTapsComponent;
