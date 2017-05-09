import React from 'react';
import { Container } from 'flux/utils';

import userListStore from '../../stores/user-list';
import { fetchUsers } from '../../actions/users';

import Loader from '../loader';
import Avatar from '../generic/avatar';


class UserList extends React.Component {

  render() {
    return (
      <div className="user-list-view view">
        <header className="page-header">
          <h1 className="page-title">Users.</h1>
        </header>

        <div className="user-list__list">
          {this.props.users.map(user => (
            <a
              className="user-list__list-item"
              href={`/#/users/${user.id}`}>
              <Avatar {...user} size={40} />
              <span>{user.name}</span>
              <span className="user-list__list-item__admin">
                {user.admin && 'admin'}
              </span>
            </a>
          ))}
        </div>
      </div>
    );
  }
}


class UserListContainer extends React.Component {
  static getStores() {
    return [userListStore];
  }

  static calculateState() {
    return {
      users: userListStore.getState(),
    };
  }

  componentWillMount() {
    fetchUsers();
  }

  render() {
    return this.state.users.fetching ? (
      <Loader />
    ) : (
      <UserList users={this.state.users.models} />
    );
  }
}

export default Container.create(UserListContainer);
