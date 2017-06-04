/**
 * CardRegister
 *
 * Users can register an NFC Card for use with TapOnTap.
 *
 */

import React from 'react';
import { Container } from 'flux/utils';

import profileStore from '../../stores/profile';
import cardRegisterStore from '../../stores/card-register';
import { reset } from '../../actions/card-register';

import CurrentStep from './card-register-steps';

const CardRegister = props => (
  <div className="view card-register">
    <header className="page-header">
      <h1 className="page-title">
        Tap On Tap
      </h1>
    </header>
    <CurrentStep {...props} />
  </div>
);

class CardRegisterContainer extends React.Component {

  static getStores() {
    return [cardRegisterStore, profileStore];
  }

  static calculateState() {
    return {
      ...cardRegisterStore.getState(),
      profile: profileStore.getState().data,
    };
  }

  componentWillMount() {
    reset(); // reset the state store
  }

  render() {
    return <CardRegister {...this.state} />;
  }
}

export default Container.create(CardRegisterContainer);
