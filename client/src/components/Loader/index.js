import React from 'react';
import classnames from 'classnames/bind';

import styles from './loader.scss';

const classes = classnames.bind(styles);

const Loader = () => (
  <div className={classes(['loader'])}>
    OnTap
  </div>
);

export default Loader;
