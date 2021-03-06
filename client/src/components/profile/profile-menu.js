import React from 'react';

import * as propTypes from '../../proptypes/';

export default class ProfileMenu extends React.Component {
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

    return (
      <div className="profile">
        { props.data && props.data.id &&
          <div className="profile-somebody">
            <img
              className="profile-avatar"
              src={`${props.data.avatar}?sz=72`}
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
            <a className="btn-login" href="/login">Login with Google</a>
          </div>
        }
      </div>
    );
  }
}
