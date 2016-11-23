/**
 * Detailed keg ratings.
 * Who rated what, etc.
 */

import React from 'react';
import groupBy from 'lodash/groupBy';

export default class KegRatingDetail extends React.Component {

  printGroup(ratings = []) {
    return ratings.map(rating => (
      <a href={`/#/users/${rating.User.id}`}>
        <img
          src={`${rating.User.avatar}?size=60`}
          title={rating.User.name}
          style={{ borderRadius: '4px', marginRight: '8px' }}
        />
      </a>
    ));
  }

  render() {
    const { Ratings } = this.props;

    const grouped = groupBy(Ratings, 'value');
    const yay = grouped[1];
    const nay = grouped[-1];
    const meh = grouped[0];

    return (
      <div className="keg-rating-detail">

        {grouped[1] && (<div className="rating-group">
          <h3>{yay.length} { yay.length > 1 ? 'people' : 'person' } <span className="emoji emoji-happy" /> this</h3>
          {this.printGroup(yay)}
        </div>)}

        {grouped[-1] && (<div className="rating-group">
          <h3>{nay.length} { nay.length > 1 ? 'people' : 'person' } <span className="emoji emoji-sad" /> this</h3>
          {this.printGroup(nay)}
        </div>)}

        {grouped[0] && (<div className="rating-group">
          <h3>{meh.length} { meh.length > 1 ? 'people' : 'person' } <span className="emoji emoji-meh" /> this</h3>
          {this.printGroup(meh)}
        </div>)}

      </div>
    );
  }
}
