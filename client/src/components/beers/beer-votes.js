/**
 * BeerVotes
 * Display the vote info for a Beer.
 */

import React from 'react';

import * as propTypes from '../../proptypes';
import { clearVotes, voteForBeer, unvoteForBeer } from '../../actions/beers';

import Avatar from '../generic/avatar';


class BeerVotes extends React.Component {

  static propTypes() {
    return {
      beer: propTypes.beerModel,
      profile: propTypes.profileModel,
    };
  }

  constructor() {
    super();
    this.clearVotes = this.clearVotes.bind(this);
    this.vote = this.vote.bind(this);
    this.unvote = this.unvote.bind(this);
  }

  clearVotes() {
    clearVotes(this.props.beer.id);
  }

  vote() {
    voteForBeer(this.props.beer.id);
  }

  unvote() {
    unvoteForBeer(this.props.beer.id);
  }

  render() {
    const { beer, profile } = this.props;
    const myVote = beer.Votes.find(vote => vote.userId === profile.id);

    const isAdmin = !!profile.admin;


    return (
      <div className="beer-votes-view">
        <div className="beer-detail-votes">
          <div>
            { myVote ?
              <button className="btn-unvote" onClick={this.unvote}>Cancel my vote</button>
              :
              <button className="btn-vote" onClick={this.vote}>Vote for this beer</button>
            }
          </div>
          <div className="beer-vote-total">{beer.Votes.length}</div>
          {beer.Votes.map(vote => <Avatar {...vote.User} />)}
        </div>

        { isAdmin && (
          <div className="beer-actions">
            <button onClick={this.clearVotes}>Reset Votes</button>
          </div>
        ) }

      </div>
    );
  }
}

export default BeerVotes;
