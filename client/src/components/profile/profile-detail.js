/**
 * ProfileDetail
 *
 * Wraps UserDetail, passing current user's profile as user.
 */


import React from 'react';

import User from '../users/user';

import autoLoader from '../loader/auto-loader';


const ProfileDetail = autoLoader(props => !props.profile.id)(props => (
  <div className="profile-detail user-detail">
    <User {...props.profile} profile={props.profile} Cheers={[]} />
  </div>
));


export default ProfileDetail;
