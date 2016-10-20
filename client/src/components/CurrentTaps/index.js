import React from 'react';
import classnames from 'classnames/bind';
import { Container } from 'flux/utils';

import Tap from './Tap';
import Profile from '../Profile';
import styles from './current-taps.css';

import tapsActions from '../../actions/taps';
import tapsStore from '../../stores/taps';


const classes = classnames.bind(styles);

const CurrentTapsComponent = props => (
  <div className={classes(['container'])}>
    <header className={classes(['app-header'])}>
      <h1><span>Comm</span>On Tap</h1>
      <Profile />
    </header>
    <section className={classes(['on-tap-list'])}>


      { props.taps.map(tap => <Tap key={tap.id} { ...tap } />) }
    </section>
    <footer className={classes(['footer'])}>
      <a href="https://github.com/commoncode/ontap">github.com/commoncode/ontap</a>
    </footer>
  </div>
);

class CurrentTapsContainer extends React.Component {
  static getStores() {
    return [tapsStore];
  }

  static calculateState() {
    return {
      taps: tapsStore.getState(),
    };
  }

  componentWillMount() {
    // fetch me the damn beers
    tapsActions.fetchTaps();
  }

  render() {
    return <CurrentTapsComponent taps={this.state.taps.data} />;
  }
}

const container = Container.create(CurrentTapsContainer);
export default container;
