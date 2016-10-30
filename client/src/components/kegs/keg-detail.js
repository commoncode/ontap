import React from 'react';
import { Container } from 'flux/utils';

import kegsStore from '../../stores/kegs';
import profileStore from '../../stores/profile';
import { fetchKeg } from '../../actions/kegs';

import KegListItem from './keg-list-item';
import Keg from './keg';
import Loader from '../loader/';
import ErrorComponent from '../error' ;

const KegDetail = props => (
  <div className="keg-detail">
    <ErrorComponent {...props.keg.error } />

    { props.keg.fetching ?
      <Loader /> :
      <KegListItem {...props.keg} profile={props.profile}/>
    }

  </div>
);

class KegDetailContainer extends React.Component {
  static propTypes() {
    return {
      kegId: React.PropTypes.number,
    };
  }

  static getStores() {
    return [kegsStore, profileStore];
  }

  static calculateState(prevState, props) {
    const state = kegsStore.getState();
    const pathToKeg = ['kegs', props.kegId];
    const keg = state.hasIn(pathToKeg) ? state.getIn(pathToKeg).toJSON() : {};

    return {
      keg,
      profile: profileStore.getState(),
    };
  }

  componentWillMount() {
    fetchKeg(this.props.kegId);
  }

  render() {
    return <KegDetail keg={this.state.keg} profile={this.state.profile} />;
  }
}

export default Container.create(KegDetailContainer, { withProps: true });
