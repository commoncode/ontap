/**
 * App component/container
 * Basically wraps the whole thing.
 *
 */

import React from 'react';
import { Container } from 'flux/utils';

import Profile from '../Profile';
import CurrentTaps from '../CurrentTaps';

import tapsActions from '../../actions/taps';
import profileActions from '../../actions/profile';
import tapsStore from '../../stores/taps';
import profileStore from '../../stores/profile';


const AppComponent = props => (
  <div className="container">
    <header className="app-header">
      <h1><span>Comm</span>On Tap</h1>
      <Profile />
    </header>

    <CurrentTaps taps={props.taps} profile={props.profile} />

    <footer className="app-footer">
      <a href="https://github.com/commoncode/ontap">github.com/commoncode/ontap</a>
    </footer>
  </div>
);

AppComponent.propTypes = {
  taps: React.PropTypes.object,
  profile: React.PropTypes.object,
};

// flux-utils container to bind our stores to our
// components.
class AppContainer extends React.Component {
  static getStores() {
    return [tapsStore, profileStore];
  }

  static calculateState() {
    return {
      taps: tapsStore.getState(),
      profile: profileStore.getState(),
    };
  }

  componentWillMount() {
    // hit the APIs
    tapsActions.fetchTaps();
    profileActions.fetchProfile();
  }

  render() {
    return (
      <AppComponent
        taps={this.state.taps.data}
        profile={this.state.profile.data}
      />
    );
  }
}

const container = Container.create(AppContainer);
export default container;
