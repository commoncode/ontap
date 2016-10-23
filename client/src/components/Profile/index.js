import React from 'react';
import classnames from 'classnames/bind';
import { Container } from 'flux/utils';

import profileActions from '../../actions/profile';
import profileStore from '../../stores/profile';
import styles from './profile.css';

const classes = classnames.bind(styles);

const Profile = ({ profile, meta }) => {
  // wait until it's fetched
  if (!meta.fetched) return null;

  return (
    <div className={classes(['profile'])}>
      { profile.email &&
        <div>
          <img
            className={classes(['avatar'])}
            src={`${profile.avatar}?sz=32`}
            title={`Logged in as ${profile.name}`}
          />
        </div>
      }

      { !profile.email &&
        <div className={classes(['nobody'])}>
          <a href="/login">Login with Google</a>
        </div>
      }
    </div>
  );
};


class ProfileContainer extends React.Component {
  static getStores() {
    return [profileStore];
  }

  static calculateState() {
    return {
      profile: profileStore.getState(),
    };
  }

  componentWillMount() {
    // get our profile info
    profileActions.fetchProfile();
  }

  render() {
    return <Profile profile={this.state.profile.data} meta={this.state.profile} />;
  }
}

const container = Container.create(ProfileContainer);
export default container;
