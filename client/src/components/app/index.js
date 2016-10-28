/**
 * App component/container
 * Basically wraps the whole thing.
 *
 */

import React from 'react';
import { Container } from 'flux/utils';

import profileStore from '../../stores/profile';
import profileActions from '../../actions/profile';
import * as propTypes from '../../proptypes/';

import ContentRouter from '../router';
import Profile from '../profile/';

const AppComponent = props => (
  <div className="container">
    <header className="app-header">
      <h1><span>Comm</span>On Tap</h1>
      <Profile {...props.profile} />
    </header>

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
