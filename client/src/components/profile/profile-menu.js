import React from 'react';

import * as propTypes from '../../proptypes/';

class ProfileMenu extends React.Component {
  static propTypes: propTypes.profile

  constructor() {
    super();
    this.state = {
      showMenu: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      showMenu: !this.state.showMenu,
    });
  }

  render() {
    const { props } = this;
    const { showMenu } = this.state;

    // wait until it's fetched
    if (!props.fetched) return null;

    return (
      <div className="profile">
        { props.data && props.data.id &&
          <div>
            <img
              className="profile-avatar"
              src={`${props.data.avatar}?sz=32`}
              alt={`Logged in as ${props.data.name}`}
              onClick={this.toggle}
            />
            <div className={`profile-menu ${showMenu && 'show'}`}>
              <a href="/#/profile">My Profile</a>
              <a href="/logout">Sign Out</a>
            </div>
          </div>
        }

        { (!props.data || !props.data.id) &&
          <div className="profile-nobody">
            <a href="/login">Login with Google</a>
          </div>
        }
      </div>
    );
  }
}

export default ProfileMenu;
