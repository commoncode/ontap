import React from 'react';
import { Container } from 'flux/utils';

import userDetailStore from '../../stores/user-detail';
import profileStore from '../../stores/profile';
import { fetchUser } from '../../actions/users';
import * as propTypes from '../../proptypes';
import autoLoader from '../loader/auto-loader';

import UserSummary from './user-summary';
import UserCheers from './user-cheers';


const UserDetail = autoLoader(props => props.user.fetching)((props) => {
  const { user, profile } = props;
  const { model } = user;

  return (
    <div className="user-detail view">
      <UserSummary {...model} profile={profile.data} />
      <UserCheers Cheers={model.Cheers} User={model} />
    </div>
  );
});

UserDetail.propTypes = {
  user: propTypes.profile,
  profile: propTypes.profile,
};

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
