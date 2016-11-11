import React from 'react';
import classnames from 'classnames/bind';

import Tap from './Tap';
import styles from './current-taps.css';

const classes = classnames.bind(styles);
const taps = [{
    tap: 'Left tap',
    beerName: 'Weizen',
    breweryName: 'Cavalier',
    abv: 5,
    notes: 'Limited Release! A mix of banana, subtle bubblegum, clove and spicy aromas are backed up by a soft, bready, slightly sweet malt flavour finishing with a mild tartness. Unfiltered and cloudy with a thick white head.'
    tapped: 'November 4',
  },{
    tap: 'Middle tap',
    beerName: 'Brown Ale',
    breweryName: 'Cavalier',
    abv: 5,
    notes: 'Using a broad mix of chocolate and crystal malts, the Cavalier Brown delivers an initial burst of caramel sweetness, followed by a dry, crisp roasted note. The perfect mix of chocolate and toasty caramel flavours. With the added complexity of aromas from classic American hops, subtle citrus notes reveal something new in every sip.',
    tapped: 'November 11',
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
