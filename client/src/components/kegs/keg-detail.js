import React from 'react';
import { Container } from 'flux/utils';

import kegDetailStore from '../../stores/keg-detail';
import profileStore from '../../stores/profile';
import { fetchKeg, deleteKeg } from '../../actions/kegs';
import * as propTypes from '../../proptypes';

import KegDetailCheers from './keg-detail-cheers';
import KegSummary from './keg-summary';
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
      beerDetails: false,
    };

    this.toggleEditing = this.toggleEditing.bind(this);
    this.deleteKeg = this.deleteKeg.bind(this);
  }

  toggleEditing() {
    this.setState({
      editing: !this.state.editing,
    });
  }

  deleteKeg() {
    deleteKeg(this.props.keg.model.id)
    .then(document.location.hash = '/');
  }

  render() {
    const { keg, profile } = this.props;
    const { editing } = this.state;
    const canEdit = profile.data && profile.data.admin;

    if (keg.fetching) return <Loader />;
    if (keg.error) return <ErrorComponent {...keg.error} />;

    return (
      <div className="keg-detail">
        <h2 className="keg-name">
          Keg {keg.model.id}: <a href={`/#/beers/${keg.model.Beer.id}/`}>{keg.model.Beer.name}</a> by {keg.model.Beer.breweryName}
        </h2>

        <KegSummary {...keg.model} />
        <KegDetailCheers {...keg.model} profile={profile} />

        { canEdit && (
          <div className="beer-actions">

            <button
              className="btn"
              onClick={this.toggleEditing}
            >Edit Keg</button>

            <button
              className="btn"
              onClick={this.deleteKeg}
            >Delete Keg</button>
          </div>
        ) }

        { editing && <KegEdit model={keg.model} successHandler={this.toggleEditing} />}


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
