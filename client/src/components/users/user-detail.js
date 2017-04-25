import React from 'react';
import { Container } from 'flux/utils';

import userDetailStore from '../../stores/user-detail';
import profileStore from '../../stores/profile';
import { fetchUser } from '../../actions/users';
import * as propTypes from '../../proptypes';

import User from './user';
import Loader from '../loader/';


class UserDetail extends React.Component {
  static propTypes() {
    return {
      user: propTypes.profile,
      profile: propTypes.profile,
    };
  }

  constructor() {
    super();
    this.state = {
      editing: false,
    };

    this.toggleEditing = this.toggleEditing.bind(this);
  }

  toggleEditing() {
    this.setState({
      editing: !this.state.editing,
    });
  }

  render() {
    const { user } = this.props;
    const { model } = user;

    return (
      <div className="user-detail">
        { user.fetching && <Loader />}

        { !user.fetching && !model && '404!' }

        { model && <User {...model} /> }



      </div>
    );
  }
}

class UserDetailContainer extends React.Component {
  static propTypes() {
    return {
      userId: React.PropTypes.number,
    };
  }

  static getStores() {
    return [userDetailStore, profileStore];
  }

  static calculateState() {
    return {
      user: userDetailStore.getState(),
      profile: profileStore.getState(),
    };
  }

  componentWillMount() {
    fetchUser(this.props.userId);
  }

  render() {
    return <UserDetail user={this.state.user} profile={this.state.profile} />;
  }
}

export default Container.create(UserDetailContainer, { withProps: true });
