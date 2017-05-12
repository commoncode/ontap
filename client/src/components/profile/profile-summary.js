/**
 * ProfileSummary.
 * Extends UserSummary so the save() and delete() calls
 * use the /profile APIs instead.
 * Everything else is the same.
 */

import autobind from 'autobind-decorator';

import { updateProfile, deleteProfile } from '../../actions/profile';

import UserSummary from '../users/user-summary';

@autobind
class ProfileSummary extends UserSummary {

  save(props) {
    updateProfile(props)
    .then(() => {
      this.setState({
        editing: false,
      });
    });
  }

  delete() { // eslint-disable-line class-methods-use-this
    deleteProfile()
    .then(() => {
      // server will destroy the session on API call
      // but the client needs to know about it too.
      document.location = '/logout';
    });
  }
}

export default ProfileSummary;
