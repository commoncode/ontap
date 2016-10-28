import React from 'react';
import classnames from 'classnames/bind';

import styles from './profile.css';
import * as propTypes from '../../proptypes/';

const classes = classnames.bind(styles);

const Profile = (props) => {
  // wait until it's fetched
  if (!props.fetched) return null;

  return (
    <div className={classes(['profile'])}>
      { props.data &&
        <div>
          <img
            role="presentation"
            className={classes(['avatar'])}
            src={`${props.data.avatar}?sz=32`}
            title={`Logged in as ${props.data.name}`}
          />
        </div>
      }

      { !props.data &&
        <div className={classes(['nobody'])}>
          <a href="/login">Login with Google</a>
        </div>
      }
    </div>
  );
};

Profile.propTypes = propTypes.profile;

export default Profile;
