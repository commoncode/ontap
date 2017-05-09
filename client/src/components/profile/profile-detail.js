/**
 * ProfileDetail
 *
 * Wraps UserDetail, passing current user's profile as user.
 */


import React from 'react';

import { fetchProfileCheers } from '../../actions/profile';

import User from '../users/user';
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
    if (!props.profile.id) return <Loader />;

    return (
      <div className="profile-detail user-detail">
        <User {...props.profile} profile={props.profile} Cheers={[]} />

        {props.profile.Cheers && (
          <UserCheers Cheers={props.profile.Cheers} User={props.profile} />
        )}
      </div>
    );
  }
}

export default ProfileDetail;
