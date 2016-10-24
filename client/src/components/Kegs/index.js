/**
 * Kegs component/container
 *
 * List of all the Kegs.
 */

import React from 'react';
import { Container } from 'flux/utils';

import Keg from '../CurrentTaps/Keg';
import KegEdit from '../Admin/KegEdit';
import Loader from '../Loader';

import { fetchKegs } from '../../actions/kegs';
import kegsStore from '../../stores/kegs';

class KegsComponent extends React.Component {

  static propTypes() {
    return {
      profile: React.PropTypes.object,
      kegs: React.PropTypes.array,
    };
  }

  constructor() {
    super();
    this.state = {
      showCreate: false,
    };

    this.toggleShowCreate = this.toggleShowCreate.bind(this);
  }

  toggleShowCreate() {
    this.setState({
      showCreate: !this.state.showCreate,
    });
  }

  render() {
    const { kegs, profile } = this.props;
    const { showCreate } = this.state;

    return (
      <section className="keg-list">
        {kegs.fetching && <Loader />}

        {kegs.fetched &&
          kegs.data.map(keg => <Keg key={keg.id} {...keg} profile={profile} />)
        }

        {profile && profile.admin &&
          <button className="btn-new-keg" onClick={this.toggleShowCreate}>Add a Keg +</button>
        }

        {showCreate &&
          <KegEdit />
        }
      </section>
    );
  }
}

class KegsContainer extends React.Component {
  static getStores() {
    return [kegsStore];
  }

  static calculateState() {
    return {
      kegs: kegsStore.getState(),
    };
  }

  componentWillMount() {
    fetchKegs();
  }

  render() {
    return (
      <KegsComponent
        kegs={this.state.kegs}
        {...this.props}
      />
    );
  }
}

export default Container.create(KegsContainer);
