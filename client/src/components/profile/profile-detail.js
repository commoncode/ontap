/**
 * ProfileDetail
 *
 * Wraps UserDetail, passing current user's profile as user.
 */


import React from 'react';

import autoLoader from '../loader/auto-loader';
import { fetchProfileCheers } from '../../actions/profile';

import User from '../users/user';
import UserCheers from '../users/user-cheers';


class ProfileDetail extends React.Component {
  componentWillMount() {
    setTimeout(() => fetchProfileCheers(), 0);
  }

  render() {
    const { props } = this;

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

export default autoLoader(props => !props.profile.id)(ProfileDetail);
