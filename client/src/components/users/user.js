import React from 'react';
import moment from 'moment';

const Cheers = props => (
  <div className="cheers-list-item">
    <span>
      <a href={`/#/kegs/${props.Keg.id}/`}>
        <b>{props.Keg.Beer.name}</b> by {props.Keg.Beer.breweryName}
      </a>
    </span>
    <span>
      {moment(props.timestamp).format('h:mma')}
      {` on ${moment(props.timestamp).format('MMMM Do, YYYY')}`}
      </span>
  </div>
);


export default (props) => {
  const firstName = props.name.split(' ')[0];
  const uniqueCheersCount = new Set(props.Cheers.map(cheers => cheers.kegId)).size;

  return (
    <div>
      <header>
        <h2>{props.name}</h2>
        <img className="avatar" src={`${props.avatar}?size=110`} />
      </header>

      <section className="user-detail-cheers">
        {props.Cheers.length ? (
          <div>
            <h3>{firstName} has Cheers'd {uniqueCheersCount} beer{uniqueCheersCount !== 1 && 's'} {props.Cheers.length} time{props.Cheers.length !== 1 && 's'}.</h3>
            <div className="cheers-list">
              {props.Cheers.map(cheers => <Cheers {...cheers} key={cheers.id} />)}
            </div>
          </div>
        ) : (
          <h3>{firstName} hasn't Cheers'd any beers. Better pour them a pint.</h3>
        )}
      </section>
    </div>
  );
};
