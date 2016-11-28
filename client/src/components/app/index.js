/**
 * App component/container
 * Basically wraps the whole thing.
 */

import React from 'react';
import { Container } from 'flux/utils';

import profileStore from '../../stores/profile';
import profileActions from '../../actions/profile';
import * as propTypes from '../../proptypes/';

import ContentRouter from '../router';
import Profile from '../profile';
import Notifications from '../notifications';

const AppComponent = props => (
  <div className="container">
    <Notifications />
    <header className="app-header">
      <h1><a href="/#/"><span>Comm</span>On Tap</a></h1>
      <Profile {...props.profile} />
    </header>
    <nav className="app-nav">
      <a href="/#/">Now On Tap</a>
      <a href="/#/beers">Beers</a>
      {props.profile && props.profile.data.admin && <a href="/#/kegs/new">Add a Keg</a> }
      {props.profile && props.profile.data.admin && <a href="/#/taps">Taps</a> }
    </nav>

    <div className="app-content">
      <ContentRouter {...props} />
    </div>

    <footer className="app-footer">
      <a href="https://github.com/commoncode/ontap">github.com/commoncode/ontap</a>
    </footer>
  </div>
);

AppComponent.propTypes = {
  profile: propTypes.profile,
};

// flux-utils container to bind stores to our components.
// any stores that will share data globally (ie profiles)
// should be mounted here and passed down
class AppContainer extends React.Component {
  static getStores() {
    return [profileStore];
  }

  static calculateState() {
    return {
      profile: profileStore.getState(),
    };
  }

  componentWillMount() {
    // hit the APIs
    profileActions.fetchProfile();
  }

  render() {
    return (
      <AppComponent
        profile={this.state.profile}
      />
    );
  }
}

const container = Container.create(AppContainer);
export default container;
