import React from 'react';
import classnames from 'classnames/bind';

import Tap from './Tap';
import styles from './current-taps.css';

const classes = classnames.bind(styles);
const taps = [{
    tap: 'Right tap',
  }, {
    tap: 'Left tap',
    beerName: 'Courage Blonde Ale',
    breweryName: 'Cavalier Brewing Co',
    abv: 4.5,
    notes: 'A crisp refreshing Blonde ale using quality all Australian ingredients. Summer Saaz hops create the soft fruity aroma and slight bitterness. The beer presents light golden in colour with a mild malt flavour making it a perfectly balanced beer for any occasion.',
    tapped: 'October 12',
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
