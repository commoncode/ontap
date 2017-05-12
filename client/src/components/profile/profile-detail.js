/**
 * ProfileDetail
 *
 * Wraps UserDetail, passing current user's profile as user.
 */


import React from 'react';

import { fetchProfileCheers } from '../../actions/profile';

import ProfileSummary from './profile-summary';
import UserCheers from '../users/user-cheers';
import Loader from '../loader';


class ProfileDetail extends React.Component {
  componentWillMount() {
    fetchProfileCheers();
  }

  render() {
    const { props } = this;

    // we can't use autoloader here because there's a dispatch call
    // in componentWillMount, which would result in a dispatch-within-a-dispatch.
    if (props.profile.fetching) return <Loader />;

    // you're not logged in
    if (!props.profile.id) {
      return (
        <div className="profile-unauthenticated view">
          <p>You have to <a href="/login">Login with Google</a> to view your Profile.</p>
        </div>
      );
    }

    return (
      <div className="profile-detail user-detail view">
        <header className="page-header">
          <h1 className="page-title">Your Profile.</h1>
        </header>
        <ProfileSummary {...props.profile} profile={props.profile} Cheers={[]} />

        {props.profile.Cheers && (
          <UserCheers Cheers={props.profile.Cheers} User={props.profile} />
        )}
      </div>
    );
  }
}

export default ProfileDetail;
