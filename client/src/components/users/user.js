import React from 'react';
import moment from 'moment';
import autobind from 'autobind-decorator';

import * as propTypes from '../../proptypes';

import UserEdit from './user-edit';

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

Cheers.propTypes = propTypes.cheersModel;

@autobind
class User extends React.Component {

  constructor() {
    super();
    this.state = {
      editing: false,
    };
  }

  toggleEdit() {
    this.setState({
      editing: !this.state.editing,
    });
  }

  render() {
    const { props } = this;
    const { profile } = props;
    const { editing } = this.state;

    const firstName = props.name.split(' ')[0];
    const uniqueCheersCount = new Set(props.Cheers.map(cheers => cheers.kegId)).size;

    const isCurrentUser = profile.id === props.id;
    const isAdmin = !!profile.admin;

    return (
      <div>
        <header>
          <h2>
            {props.name}
            {(isCurrentUser || isAdmin) && (
              <p className="btn-edit-user">
                <a onClick={this.toggleEdit}>Edit Profile</a>
              </p>
            )}
          </h2>
          <img alt={props.name} className="avatar" src={`${props.avatar}?size=120`} />
        </header>

        {editing && (
          <UserEdit model={props} isAdmin={isAdmin} reset={this.toggleEdit} />
        )}

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

  }
};

User.propTypes = propTypes.profileModel;

export default User;
