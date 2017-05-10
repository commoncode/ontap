import React from 'react';
import autobind from 'autobind-decorator';

import * as propTypes from '../../proptypes';

import UserEdit from './user-edit';

@autobind
class UserSummary extends React.Component {

  constructor() {
    super();
    this.state = {
      editing: false,
    };
  }

  toggleEdit() {
    this.setState({
      editing: !this.state.editing,
    });
  }

  render() {
    const { props } = this;
    const { profile } = props;
    const { editing } = this.state;

    const isCurrentUser = profile.id === props.id;
    const isAdmin = !!profile.admin;

    return (
      <div>
        <header>
          <h2>
            {props.name}
            {(isCurrentUser || isAdmin) && (
              <p className="btn-edit-user">
                <a onClick={this.toggleEdit}>Edit Profile</a>
              </p>
            )}
          </h2>
          <img alt={props.name} className="avatar" src={`${props.avatar}?size=120`} />
        </header>

        {editing && (
          <UserEdit
            model={props}
            isAdmin={isAdmin}
            isCurrentUser={isCurrentUser}
            reset={this.toggleEdit}
          />
        )}
      </div>
    );
  }
}

UserSummary.propTypes = propTypes.profileModel;

export default UserSummary;
