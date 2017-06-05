import React from 'react';
import reactPropTypes from 'prop-types';
import moment from 'moment';

import * as propTypes from '../../proptypes';


export const UserCheersItem = (props) => {
  const { Keg } = props;
  const { Beer } = Keg;
  const { Brewery } = Beer;

  const timestamp = moment(props.timestamp);

  return (
    <div className="list-item">
      <span className="column">
        <b><a href={`/#/kegs/${Keg.id}/`}>{Beer.name}</a></b>
        &nbsp;by&nbsp;
        <a href={`/#/breweries/${Brewery.id}`}>{Brewery.name}</a>
      </span>
      <span className="column end">
        {timestamp.fromNow()}
      </span>
    </div>
  );
};

UserCheersItem.propTypes = propTypes.cheersModel;


const UserCheers = (props) => {
  const firstName = props.User.name.split(' ')[0];
  const uniqueCheersCount = new Set(props.Cheers.map(cheers => cheers.kegId)).size;

  return (
    <div className="user-cheers">
      {props.Cheers.length ? (
        <div>
          <h3 className="list-title">{firstName} has Cheers'd {uniqueCheersCount} beer{uniqueCheersCount !== 1 && 's'} {props.Cheers.length} time{props.Cheers.length !== 1 && 's'}.</h3>
          <div className="cheers-list single-line-list">
            {props.Cheers.map(cheers => <UserCheersItem {...cheers} key={cheers.id} />)}
          </div>
        </div>
      ) : (
        <p className="no-cheers">{firstName} hasn't Cheers'd any beers. Better pour them a pint.</p>
      )}
    </div>
  );
};

UserCheers.propTypes = {
  User: reactPropTypes.shape(propTypes.userModel),
  Cheers: reactPropTypes.arrayOf(reactPropTypes.shape(propTypes.cheersModel)),
};

export default UserCheers;
