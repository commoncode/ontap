import React from 'react';
import reactPropTypes from 'prop-types';
import moment from 'moment';

import * as propTypes from '../../proptypes';


const UserCheersItem = props => (
  <div className="cheers-list-item">
    <span>
      <a href={`/#/kegs/${props.Keg.id}/`}>
        <b>{props.Keg.Beer.name}</b> by {props.Keg.Beer.Brewery.name}
      </a>
    </span>
    <span>
      {moment(props.timestamp).format('h:mma')}
      {` on ${moment(props.timestamp).format('MMMM Do, YYYY')}`}
    </span>
  </div>
);

UserCheersItem.propTypes = propTypes.cheersModel;


const UserCheers = (props) => {
  const firstName = props.User.name.split(' ')[0];
  const uniqueCheersCount = new Set(props.Cheers.map(cheers => cheers.kegId)).size;

  return (
    <div className="user-cheers">
      {props.Cheers.length ? (
        <div>
          <h3>{firstName} has Cheers'd {uniqueCheersCount} beer{uniqueCheersCount !== 1 && 's'} {props.Cheers.length} time{props.Cheers.length !== 1 && 's'}.</h3>
          <div className="cheers-list">
            {props.Cheers.map(cheers => <UserCheersItem {...cheers} key={cheers.id} />)}
          </div>
        </div>
      ) : (
        <h3>{firstName} hasn't Cheers'd any beers. Better pour them a pint.</h3>
      )}
    </div>
  );
};

UserCheers.propTypes = {
  User: reactPropTypes.shape(propTypes.userModel),
  Cheers: reactPropTypes.arrayOf(reactPropTypes.shape(propTypes.cheersModel)),
};

export default UserCheers;
