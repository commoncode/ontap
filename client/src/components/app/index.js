/**
 * App component/container
 * Basically wraps the whole thing.
 */

import React from 'react';
import reactPropTypes from 'prop-types';
import { Container } from 'flux/utils';
import autobind from 'autobind-decorator';

import profileStore from '../../stores/profile';
import { fetchProfile } from '../../actions/profile';
import * as propTypes from '../../proptypes/';

import ContentRouter from '../router';
import ProfileMenu from '../profile/profile-menu';
import Notifications from '../notifications';


@autobind
class AppComponent extends React.Component {

  static propTypes() {
    return {
      profile: reactPropTypes.shape(propTypes.userModel),
    };
  }

  constructor() {
    super();

    this.state = {
      showMenu: false,
    };
  }

  toggleMenu(evt) {
    evt.preventDefault();
    this.setState({
      showMenu: !this.state.showMenu,
    });
    console.log('ayo');
  }

  render() {
    const { props } = this;
    const isAdmin = props.profile && props.profile.data.admin;
    const { showMenu } = this.state;

    const menuClassName = `app-nav ${showMenu ? 'show-menu' : ''}`;

    return (
      <div className="container">
        <Notifications />
        <header className="app-header">
          <a href="/#/" className="logo">
            <img
              src="/public/favicon.png"
              title="On Tap"
              role="presentation"
            />
          </a>
          <button
            className="btn-toggle-menu"
            onClick={this.toggleMenu}
          >menu</button>
          <ProfileMenu {...props.profile} />
        </header>
        <nav className={menuClassName}>
          <a href="/#/">Now On Tap</a>
          <a href="/#/beers">Beers</a>
          <a href="/#/breweries">Breweries</a>
          <a href="/#/users">Users</a>
          {isAdmin && <a href="/#/kegs/new">Add Keg</a> }
          {isAdmin && <a href="/#/taps">Change Taps</a> }
        </nav>

        <div className="app-content">
          <ContentRouter {...props} />
        </div>

      </div>
    );
  }
}

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
    fetchProfile();
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
