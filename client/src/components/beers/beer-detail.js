/**
 * Beer Detail component.
 *
 * Show a single beer with editing and deleting.
 */

import React from 'react';
import { Container } from 'flux/utils';

import { fetchBeer, deleteBeer, toggleEditBeer, clearVotes, voteForBeer, unvoteForBeer } from '../../actions/beers';
import beerDetailStore from '../../stores/beer-detail';
import profileStore from '../../stores/profile';
import * as propTypes from '../../proptypes';

import Loader from '../loader/';
import BeerEdit from './beer-edit';
import Avatar from '../generic/avatar';

class BeerDetail extends React.Component {
  static propTypes() {
    return {
      beer: propTypes.beer,
      profile: propTypes.profile,
    };
  }

  constructor() {
    super();

    // todo - autobind decorator
    this.deleteBeer = this.deleteBeer.bind(this);
    this.clearVotes = this.clearVotes.bind(this);
    this.vote = this.vote.bind(this);
    this.unvote = this.unvote.bind(this);
  }

  deleteBeer() {
    deleteBeer(this.props.beer.model.id)
    .then(document.location.hash = '/beers');
  }

  clearVotes() {
    clearVotes(this.props.beer.model.id);
  }

  vote() {
    voteForBeer(this.props.beer.model.id);
  }

  unvote() {
    unvoteForBeer(this.props.beer.model.id);
  }

  render() {
    const { fetching, editing, model } = this.props.beer;
    const { profile } = this.props;

    const myVote = model && profile.data && model.Votes.find(vote => vote.userId === profile.data.id);
    const isMyBeer = model && profile.data && model.addedBy === profile.data.id;
    const isAdmin = profile.data && profile.data.admin;

    return (
      <div>
        { fetching ? <Loader /> :
          <div className="beer-detail-view">
            <div className="beer-details">
              <div className="primary">
                <h1 className="name">{model.name}</h1>
                <h2 className="brewery-name">{model.breweryName}</h2>
                <h4 className="variety">{model.variety}</h4>
              </div>
              <div className="meta">
                <p>{model.abv ? `${model.abv}%` : '?'} ABV</p>
                <p>{model.ibu ? model.ibu : '?'} IBU</p>
                <Avatar {...model.addedByUser} size="40" />
                {model.canBuy && (
                  <div
                    className="can-buy emoji-beers"
                    title="Supplier confirmed for this beer"
                  />
                  )}
              </div>
              <p className="notes">{model.notes}</p>
            </div>

            <div className="beer-detail-votes">
              <div>
                { myVote ?
                  <button className="btn-unvote" onClick={this.unvote}>Cancel my vote</button>
                  :
                  <button className="btn-vote" onClick={this.vote}>Vote for this beer</button>
                }
              </div>
              <div className="beer-vote-total">{model.Votes.length}</div>
              {model.Votes.map(vote => <Avatar {...vote.User} />)}
            </div>

            { isAdmin && (
              <div className="beer-actions">
                <button onClick={toggleEditBeer}>Edit Beer</button>
                <button onClick={this.clearVotes}>Reset Votes</button>
                <button onClick={this.deleteBeer}>Delete Beer</button>
              </div>
            ) }


            { editing && <BeerEdit model={model} profile={profile} /> }
          </div>
        }
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
