/**
 * Beer Detail component.
 *
 * Show a single beer with editing and deleting.
 */

import React from 'react';
import { Container } from 'flux/utils';

import { fetchBeer, deleteBeer, toggleEditBeer } from '../../actions/beers';
import beerDetailStore from '../../stores/beer-detail';
import profileStore from '../../stores/profile';
import * as propTypes from '../../proptypes';

import Loader from '../loader/';
import BeerEdit from './beer-edit';
import BeerSummary from './beer-summary';
import BeerVotes from './beer-votes';
import BeerKegs from './beer-kegs';

class BeerDetail extends React.Component {
  static propTypes() {
    return {
      beer: propTypes.beer,
      profile: propTypes.profile,
    };
  }

  constructor() {
    super();
    this.deleteBeer = this.deleteBeer.bind(this);
  }

  deleteBeer() {
    deleteBeer(this.props.beer.model.id)
    .then(document.location.hash = '/beers');
  }

  render() {
    const { fetching, editing, model } = this.props.beer;
    const { profile } = this.props;

    const isAdmin = profile.data && profile.data.admin;

    if (fetching) return <Loader />;

    return (
      <div>
        <div className="beer-detail-view">
          <BeerSummary {...model} />
          <BeerVotes beer={model} profile={profile.data} />
          <BeerKegs beer={model} profile={profile.data} />

          { isAdmin && (
            <div className="beer-actions">
              <button onClick={toggleEditBeer}>Edit Beer</button>
              <button onClick={this.deleteBeer}>Delete Beer</button>
            </div>
          ) }

          { editing && <BeerEdit model={model} profile={profile} /> }
        </div>
      </div>
    );
  }
}

class BeerDetailContainer extends React.Component {
  static getStores() {
    return [beerDetailStore, profileStore];
  }

  static calculateState() {
    return {
      beer: beerDetailStore.getState(),
      profile: profileStore.getState(),
    };
  }

  componentWillMount() {
    fetchBeer(this.props.beerId);
  }

  render() {
    return <BeerDetail beer={this.state.beer} profile={this.state.profile} />;
  }
}

export default Container.create(BeerDetailContainer, { withProps: true });
