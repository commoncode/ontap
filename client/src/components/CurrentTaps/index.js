import React from 'react';
import classnames from 'classnames/bind';

import Tap from './Tap';
import styles from './current-taps.css';

const classes = classnames.bind(styles);
const taps = [{
    tap: 'Right tap',
  }, {
    tap: 'Left tap',
    beerName: 'Saison',
    breweryName: 'Hawkers',
    abv: 5.6,
    notes: 'Refreshing, effervescent, cloudy-golden and complex, this is our take on the traditional Wallonian Saison.',
  },
];

const CurrentTapsComponent = props => (
  <div className={classes(['container'])}>
  	<header className={classes(['app-header'])}>
      <h1><span>Comm</span>On Tap</h1>
    </header>
    <section className={classes(['on-tap-list'])}>
      {
        taps.map(tap => <Tap key={tap.tap} { ...tap } />)
      }
    </section>
    <footer className={classes(['footer'])}>
      <a href="https://github.com/commoncode/ontap">github.com/commoncode/ontap</a>
    </footer>
  </div>
)
export default CurrentTapsComponent;
