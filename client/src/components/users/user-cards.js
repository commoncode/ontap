import React from 'react';
import reactPropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import moment from 'moment';

import { cardModel } from '../../proptypes';
import { deleteCard } from '../../actions/cards';

@autobind
class UserCardsItem extends React.Component {

  constructor() {
    super();
    this.state = {
      deleting: false,
    };
  }

  delete() {
    this.setState({
      deleting: true,
    });
    return deleteCard(this.props.id);
  }

  render() {
    const { props } = this;
    return (
      <div className="list-item">
        <div className="column">
          {props.name}
        </div>
        <div className="column">
          {props.uid}
        </div>
        <div className="column">
          {moment(props.createdAt).format('MMM Do YYYY')}
        </div>
        <div className="column end">
          <button className="btn small" onClick={this.delete}>delete</button>
        </div>
      </div>
    );
  }
}

UserCardsItem.propTypes = cardModel;

const UserCards = props => (
  <div className="user-cards">
    <h3 className="list-title">NFC Tokens</h3>
    {props.cards.length ? (
      <div className="cards-list single-line-list">
        <div className="list-header list-item">
          <div className="column">Name</div>
          <div className="column">UID</div>
          <div className="column">Added</div>
          <div className="column end" />
        </div>
        {props.cards.map(card => <UserCardsItem {...card} key={card.id} />)}
      </div>
    ) : (
      <p>You haven't registered any NFC Tokens. <a href="/#/tapontap"><b>Register one now.</b></a></p>
    )}
  </div>
);

UserCards.propTypes = {
  cards: reactPropTypes.arrayOf(reactPropTypes.shape(cardModel)),
};

export default UserCards;
