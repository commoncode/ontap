import React from 'react';
import { Container } from 'flux/utils';

import KegEdit from './keg-edit';

import kegsStore from '../../stores/kegs';
import { fetchKeg } from '../../actions/kegs';

const KegEditComponent = props => (
  <div>
    <KegEdit {...props} />
  </div>
);

class KegEditContainer extends React.Component {
  static propTypes() {
    return {
      kegId: React.PropTypes.number,
    };
  }

  static getStores() {
    return [kegsStore];
  }

  static calculateState(prevState, props) {
    return {
      keg: kegsStore.getState().kegs[props.kegId],
    };
  }

  componentWillMount() {
    fetchKeg(this.props.kegId);
  }

  render() {
    return <KegEditComponent keg={this.state.keg} />;
  }
}

export default Container.create(KegEditContainer, { withProps: true });
