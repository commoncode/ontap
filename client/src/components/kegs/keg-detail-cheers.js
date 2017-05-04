/**
 * List of the Cheerses on a Keg.
 * Who Cheersed, when they did it.
 */

import React from 'react';
import moment from 'moment';

import Avatar from '../generic/avatar';

export default class KegDetailCheers extends React.Component {

  render() {
    const { Cheers } = this.props;
    const uniqueCheersCount = new Set(Cheers.map(k => k.userId)).size;

    return (

      <div className="keg-detail-cheers">

        <h3>{Cheers.length} Cheers from {uniqueCheersCount} user{uniqueCheersCount !==  1 && 's'}:</h3>

        <div className="cheers-list">
          {Cheers.map(cheers => (
            <div className="cheers-list-item" key={cheers.id}>
              <Avatar {...cheers.User} size={30} />
              <span>
                <b>{cheers.User.name}</b> at {moment(cheers.timestamp).format('h:mma')}
                {` on ${moment(cheers.timestamp).format('MMMM Do, YYYY')}`}
              </span>

            </div>)
          )}
        </div>

      </div>
    );
  }
}
