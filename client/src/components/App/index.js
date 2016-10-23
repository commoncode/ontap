/**
 * App component/container
 * Basically wraps the whole thing.
 *
 */

import React from 'react';
import { Container } from 'flux/utils';

import Profile from '../Profile';
import CurrentTaps from '../CurrentTaps';
import Kegs from '../Kegs';

import tapsActions from '../../actions/taps';
import { fetchKegs } from '../../actions/kegs';
import profileActions from '../../actions/profile';

import tapsStore from '../../stores/taps';
import profileStore from '../../stores/profile';
import kegsStore from '../../stores/kegs';


const AppComponent = props => (
  <div className="container">
    <header className="app-header">
      <h1><span>Comm</span>On Tap</h1>
      <Profile />
    </header>

    <div className="app-content">
      <CurrentTaps taps={props.taps} profile={props.profile} />

    </div>

    <footer className="app-footer">
      <a href="https://github.com/commoncode/ontap">github.com/commoncode/ontap</a>
    </footer>
  </div>
);

AppComponent.propTypes = {
  taps: React.PropTypes.object,
  profile: React.PropTypes.object,
  kegs: React.PropTypes.object,
};

// flux-utils container to bind our stores to our
// components.
class AppContainer extends React.Component {
  static getStores() {
    return [tapsStore, profileStore, kegsStore];
  }

  static calculateState() {
    return {
      taps: tapsStore.getState(),
      kegs: kegsStore.getState(),
      profile: profileStore.getState(),
    };
  }

  componentWillMount() {
    // hit the APIs
    tapsActions.fetchTaps();
    profileActions.fetchProfile();
    // fetchKegs();
  }

  render() {
    return (
      <AppComponent
        taps={this.state.taps}
        profile={this.state.profile.data}
        kegs={this.state.kegs}
      />
    );
  }
}

const container = Container.create(AppContainer);
export default container;
