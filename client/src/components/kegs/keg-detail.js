import React from 'react';
import { Container } from 'flux/utils';

import kegDetailStore from '../../stores/keg-detail';
import profileStore from '../../stores/profile';
import { fetchKeg } from '../../actions/kegs';
import propTypes from '../../proptypes';

import Keg from './keg';
import KegEdit from './keg-edit';
import Loader from '../loader/';
import ErrorComponent from '../error' ;

class KegDetail extends React.Component {
  static propTypes() {
    return {
      keg: propTypes.keg,
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
    const { keg, profile } = this.props;
    const { editing } = this.state;
    const canEdit = profile.data && profile.data.admin;

    return (
      <div className="keg-detail">
        <ErrorComponent {...keg.error} />

        { keg.fetching && <Loader />}

        { keg.model && (
          <div>
            <Keg {...keg.model} profile={profile} />
          </div>
        ) }

        { canEdit && (
          <button
            className="btn"
            onClick={this.toggleEditing}
          >Edit this Keg</button>
        ) }

        { editing && <KegEdit model={keg.model} />}


      </div>
    );
  }
}

class KegDetailContainer extends React.Component {
  static propTypes() {
    return {
      kegId: React.PropTypes.number,
    };
  }

  static getStores() {
    return [kegDetailStore, profileStore];
  }

  static calculateState() {
    return {
      keg: kegDetailStore.getState(),
      profile: profileStore.getState(),
    };
  }

  componentWillMount() {
    fetchKeg(this.props.kegId);
  }

  render() {
    return <KegDetail keg={this.state.keg} profile={this.state.profile} />;
  }
}

export default Container.create(KegDetailContainer, { withProps: true });
