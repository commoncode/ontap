/**
 * Beers component/container
 *
 * Lists all the Beers.
 * Beers are things we can buy
 */

import React from 'react';
import { Container } from 'flux/utils';

import { fetchBeers, voteForBeer, unvoteForBeer, showAddBeer } from '../../actions/beers';
import beersStore from '../../stores/beers';
import * as propTypes from '../../proptypes/';

import Loader from '../loader/';
import BeerEdit from './beer-edit';

class BeerListItem extends React.Component {
  static propTypes() {
    return propTypes.beerModel;
  }

  constructor() {
    super();
    this.vote = this.vote.bind(this);
    this.unvote = this.unvote.bind(this);
  }

  vote() {
    voteForBeer(this.props.id);
  }

  unvote() {
    unvoteForBeer(this.props.id);
  }

  render() {
    const beer = this.props;
    const { profile } = beer;

    const myVote = beer.Votes.find(vote => vote.userId === profile.id);

    return (
      <div className="beer-list-item">
        <header>
          <h4 className="name">
            <a href={`/#/beers/${beer.id}/`}>{beer.name || 'unnamed'}</a>
            &nbsp;
            {beer.breweryName && <span>({beer.breweryName})</span>}
          </h4>
          {beer.variety && <h5 className="variety">{beer.variety}</h5>}
        </header>
        <div className="meta">
          {beer.abv && <span>{beer.abv}% ABV</span>}
          {beer.ibu && <span>{beer.ibu} IBU</span>}
          {beer.canBuy && <div className="emoji-beers" />}
        </div>

        <div className="votes">
          { myVote ?
            <button className="btn-unvote" onClick={this.unvote}>Unvote</button>
            :
            <button className="btn-vote" onClick={this.vote}>Vote</button>
          }
          <span className="beer-vote-total">{beer.Votes.length}</span>
        </div>
      </div>
    );
  }
}


// todo - use the react compose fork thing to handle sync.fetching
class BeerList extends React.Component {

  constructor() {
    super();
    this.state = {
      adding: false,
    };
  }

  render() {
    const { beers, sync, create, profile } = this.props;

    // most votes first
    const sortedBeers = beers.sort((a, b) => b.Votes.length - a.Votes.length);

    return (
      <div>
        { sync.fetching ? <Loader /> : (

          <section className="beer-list-view">
            <header className="page-header">
              <h1 className="page-title">Beers.</h1>
              <h2 className="page-subtitle">Vote for what you want to drink next.</h2>
              <p className="canbuy-help-text">
                Beers with a <span className="emoji-beers" /> have a
                confirmed supplier and can be ordered ASAP.
              </p>
            </header>

            <section className="beer-list">
              { sortedBeers.map(beer => (
                <BeerListItem key={beer.id} profile={profile} {...beer} />)
              ) }
            </section>

            { profile && profile.id && (
              <div className="beer-list-add-beer">

                { !create.showForm ?
                  <button className="btn-add-beer" onClick={showAddBeer} >Add a Beer +</button>
                  :
                  <BeerEdit syncing={create.syncing} />
                }
              </div>

            )}

          </section>
        ) }

      </div>
    );
  }
}

BeerList.propTypes = {
  beers: propTypes.beers,
  create: React.PropTypes.object,
  profile: propTypes.profile,
  sync: propTypes.sync,
};


class BeerListContainer extends React.Component {
  static getStores() {
    return [beersStore];
  }

  static calculateState() {
    return {
      beersState: beersStore.getState(),
    };
  }

  componentWillMount() {
    fetchBeers();
  }

  render() {
    // todo - when's the best time to convert our store Immutable data
    // to regular Arrays and JSON? Ever? Or should components just expect
    // and handle Immutables...?
    return (
      <BeerList
        beers={this.state.beersState.get('beers').toArray()}
        sync={this.state.beersState.get('sync').toJSON()}
        create={this.state.beersState.get('create').toJSON()}
        {...this.props}
      />
    );
  }
}

export default Container.create(BeerListContainer);
