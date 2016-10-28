import React from 'react';
import classnames from 'classnames/bind';
import { Container } from 'flux/utils';

import Loader from '../Loader';

import Tap from './Tap';
import styles from './taps.css';

import { fetchTaps } from '../../actions/taps';
import tapsStore from '../../stores/taps';

const classes = classnames.bind(styles);

const CurrentTapsComponent = (props) => {
  const { taps, profile, sync } = props;

  return (
    <section className={classes(['on-tap-list'])}>
      {sync.fetching && <Loader />}

      {taps.map(tap => <Tap key={tap.model.id} {...tap} profile={profile} />) }
    </section>
  );
};

CurrentTapsComponent.propTypes = {
  profile: React.PropTypes.object,
  taps: React.PropTypes.array,
  sync: React.PropTypes.object,
};


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
    fetchTaps();
  }

  render() {
    return (
      <CurrentTapsComponent
        taps={this.state.taps.get('taps').toArray().map(map => map.toJSON())}
        sync={this.state.taps.get('sync').toJSON()}
        {...this.props}
      />
    );
  }
}

export default Container.create(CurrentTapsContainer);
