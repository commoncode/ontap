import React from 'react';
import autobind from 'autobind-decorator';

import * as propTypes from '../../proptypes/';

@autobind
export default class ProfileMenu extends React.Component {
  static propTypes: propTypes.profile

  constructor() {
    super();
    this.state = {
      showMenu: false,
    };
  }

  toggle() {
    this.setState({
      showMenu: !this.state.showMenu,
    });
  }

  hide() {
    this.setState({
      showMenu: false,
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
              <a href="/#/profile" onClick={this.hide}>My Profile</a>
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
