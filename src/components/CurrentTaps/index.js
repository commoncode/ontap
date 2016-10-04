import React from 'react';
import classnames from 'classnames/bind';
import styles from './current-taps.css';
const classes = classnames.bind(styles);

const CurrentTapsComponent = props => (
  <div className={classes(['container'])}>
  	<header className={classes(['app-header'])}>
      <h1><span>Comm</span>On Tap</h1>
    </header>
    <section className={classes(['on-tap-list'])}>
      <article className={classes(['tap'])}>
        <div className={classes(['tap-name'])}>Left Tap
        </div>
        <div className={classes(['beer'])}>
          <header>
            <div className={classes(['title'])}>
              <h2 className={classes(['beer-name'])}>Saison</h2>
              <h3 className={classes(['brewery-name'])}>Hawkers</h3>
            </div>
            <p className={classes(['abv'])}>5.6%</p>
          </header>
          <p className={classes(['notes'])}>
            Refreshing, effervescent, cloudy-golden and complex, this is our take on the traditional Wallonian Saison.
          </p>
        </div>
      </article>

      <article className={classes(['tap'])}>
        <h2 className={classes(['tap-name'])}>Right Tap</h2>
        <div className={classes(['beer'])}>
          <header>
            <div className={classes(['title'])}>
              <h2 className={classes(['beer-name'])}>Steam Ale</h2>
              <h3 className={classes(['brewery-name'])}>Mountain Goat</h3>
            </div>
            <p className={classes(['abv'])}>4.5%</p>
          </header>
          <p className={classes(['notes'])}>
            The Steam is a crisp, certified organic ale. We incorporate a slap of wheat malt in the grist make-up and ferment it cool. We use Cascade and Citra hops to give it a fresh, zippy finish. Great as the weather warms up.
          </p>
        </div>
      </article>
    </section>
    <footer className={classes(['footer'])}>
      <a href="https://github.com/commoncode/ontap">github.com/commoncode/ontap</a>
    </footer>
  </div>
)

export default CurrentTapsComponent;
