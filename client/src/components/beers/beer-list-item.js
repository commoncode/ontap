/**
 * BeerListItem.
 *
 * Single beer in the list.
 */

import React from 'react';

import { voteForBeer, unvoteForBeer } from '../../actions/beers';
import * as propTypes from '../../proptypes';

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
      <div className={`beer-list-item ${beer.canBuy ? 'available' : 'unavailable'}`}>
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

export default BeerListItem;
