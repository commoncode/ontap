import React from 'react';
import reactPropTypes from 'prop-types';
import { Container } from 'flux/utils';

import userListStore from '../../stores/user-list';
import profileStore from '../../stores/profile';
import { fetchUsers } from '../../actions/users';
import * as propTypes from '../../proptypes';

import Loader from '../loader';
import Avatar from '../generic/avatar';


const UserList = (props) => {
  const isAdmin = !!props.profile.admin;

  return (
    <div className="user-list-view view">
      <header className="page-header">
        <h1 className="page-title">Users.</h1>
      </header>

      <div className="user-list__list">
        {props.users.map(user => (
          <a
            className="user-list__list-item"
            href={`/#/users/${user.id}`}
            key={user.id}
          >
            <Avatar {...user} size={40} />
            <span>{user.name}</span>
            <span className="user-list__list-item__admin">
              {isAdmin && user.admin && 'admin'}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

UserList.propTypes = {
  profile: reactPropTypes.shape(propTypes.userModel),
  users: reactPropTypes.arrayOf(reactPropTypes.shape(propTypes.userModel)),
};

class UserListContainer extends React.Component {
  static getStores() {
    return [userListStore];
  }

  static calculateState() {
    return {
      users: userListStore.getState(),
      profile: profileStore.getState(),
    };
  }

  componentWillMount() {
    fetchUsers();
  }

  render() {
    return this.state.users.fetching ? (
      <Loader />
    ) : (
      <UserList users={this.state.users.models} profile={this.state.profile.data}/>
    );
  }
}

export default Container.create(UserListContainer);
