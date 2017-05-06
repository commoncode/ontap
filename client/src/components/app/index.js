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
import HeaderProfile from '../profile/profile-header';
import Notifications from '../notifications';

const AppComponent = (props) => {
  const isAdmin = props.profile && props.profile.data.admin;

  return (
    <div className="container">
      <Notifications />
      <header className="app-header">
        <h1><a href="/#/">On Tap</a></h1>
        <HeaderProfile {...props.profile} />
      </header>
      <nav className="app-nav">
        <a href="/#/">Now On Tap</a>
        <a href="/#/beers">Beers</a>
        <a href="/#/users">Users</a>
        {isAdmin && <a href="/#/kegs/new">Add Keg</a> }
        {isAdmin && <a href="/#/taps">Change Taps</a> }
      </nav>

      <div className="app-content">
        <ContentRouter {...props} />
      </div>

      <footer className="app-footer">
        <a href="https://github.com/commoncode/ontap">github.com/commoncode/ontap</a>
      </footer>
    </div>
  );
};

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
