/**
 * List of the Cheerses on a Keg.
 * Who Cheersed, when they did it.
 */

import React from 'react';
import propTypes from 'prop-types';
import moment from 'moment';

import { cheersModel } from '../../proptypes';

import Avatar from '../generic/avatar';

export default class KegDetailCheers extends React.Component {

  render() {
    const { Cheers } = this.props;
    const uniqueCheersCount = new Set(Cheers.map(k => k.userId)).size;

    return (

      <div className="keg-detail-cheers">

        { Cheers.length ? (
          <div>
            <h3 className="list-title">{Cheers.length} Cheers from {uniqueCheersCount} user{uniqueCheersCount !== 1 && 's'}:</h3>
            <div className="cheers-list single-line-list">
              {Cheers.map(cheers => (
                <div className="list-item" key={cheers.id}>
                  <div className="column">
                    <Avatar {...cheers.User} size={30} />
                    <span><b>
                      <a href={`/#/users/${cheers.User.id}/`}>
                        {cheers.User.name}
                      </a>
                    </b></span>
                  </div>
                  <div className="column end">
                    {`${moment(cheers.timestamp).format('MMM D YYYY')} at ${moment(cheers.timestamp).format('h:mma')}`}
                  </div>
                </div>)
              )}
            </div>
          </div>
        ) : (
          <h3>Nobody's Cheers'd this Keg. Bummer.</h3>
        )}
      </div>
    );
  }
}

KegDetailCheers.propTypes = {
  Cheers: propTypes.arrayOf(propTypes.shape(cheersModel)),
};
