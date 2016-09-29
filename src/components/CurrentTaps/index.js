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
        <div className={classes(['tap-name'])}>Left
        </div>
        <div className={classes(['beer'])}>
          <header>
            <h2 className={classes(['beer-name'])}>Steam Ale</h2>
            <h3 className={classes(['brewery-name'])}>Mountain Goat</h3>
          </header>
          <p className={classes(['notes'])}>
            The Steam is a crisp, certified organic ale. We incorporate a slap of wheat malt in the grist make-up and ferment it cool. We use Cascade and Citra hops to give it a fresh, zippy finish. Great as the weather warms up.
          </p>
        </div>
        <div className={classes(['meta'])}>
          <p className={classes(['abv'])}>4.5%</p>
        </div>
      </article>

      <article className={classes(['tap'])}>
        <h2 className={classes(['tap-name'])}>Right</h2>
        <div className={classes(['beer'])}>
          <header>
            <h2 className={classes(['beer-name'])}>Saison</h2>
            <h3 className={classes(['brewery-name'])}>Hawkers</h3>
          </header>
          <p className={classes(['notes'])}>
            Refreshing, effervescent, cloudy-golden and complex, this is our take on the traditional Wallonian Saison.
          </p>
        </div>
        <div className={classes(['meta'])}>
          <p className={classes(['abv'])}>5.6%</p>
        </div>
      </article>

      <article className={classes(['tap no-service'])}>
        <h2 className={classes(['tap-name'])}>Middle</h2>
        <div className={classes(['beer'])}>
          <header>
            <h2 className={classes(['beer-name'])}>No Service</h2>
          </header>
        </div>
      </article>

      <article className={classes(['tap no-service'])}>
        <h2 className={classes(['tap-name'])}>Green Fridge</h2>
        <div className={classes(['beer'])}>
          <header>
            <h2 className={classes(['beer-name'])}>No Service</h2>
          </header>
        </div>
      </article>
    </section>
  </div>
)

export default CurrentTapsComponent;
