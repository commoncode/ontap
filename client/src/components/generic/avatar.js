/**
 * Avatar.
 * Show a user's avatar and link to their profile.
 */

import React from 'react';
import { profile } from '../../proptypes';

const Avatar = props => (
  <div className="avatar">
    <a href={`/#/users/${props.id}/`}>
      <img
        alt={props.name}
        title={props.name}
        src={`${props.avatar}?size=${props.size || 60}`}
      />
    </a>
  </div>
);

Avatar.propTypes = profile;

export default Avatar;
