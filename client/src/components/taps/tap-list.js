import React from 'react';
import reactPropTypes from 'prop-types';
import { Container } from 'flux/utils';

import { fetchTaps } from '../../actions/taps';
import tapsStore from '../../stores/taps';
import * as propTypes from '../../proptypes';

import Loader from '../loader';
import Tap from './tap';

const TapList = (props) => {
  const { taps, profile, sync } = props;

  return (
    <section className="on-tap-list">
      {sync.fetching && <Loader />}
      {taps.map(tap => <Tap key={tap.id} model={tap} profile={profile} />) }
    </section>
  );
};

TapList.propTypes = {
  profile: reactPropTypes.shape(propTypes.profile),
  taps: reactPropTypes.arrayOf(reactPropTypes.shape(propTypes.tapModel)),
  sync: reactPropTypes.shape(propTypes.sync),
};


class TapListContainer extends React.Component {
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
      <TapList
        taps={this.state.taps.get('taps').toArray()}
        sync={this.state.taps.get('sync').toJSON()}
        {...this.props}
      />
    );
  }
}

export default Container.create(TapListContainer);
