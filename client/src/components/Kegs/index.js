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

import { fetchKegs, toggleCreateKeg } from '../../actions/kegs';
import kegsStore from '../../stores/kegs';

class KegsComponent extends React.Component {

  static propTypes() {
    return {
      profile: React.PropTypes.object,
      kegs: React.PropTypes.array,
      sync: React.PropTypes.object,
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
    toggleCreateKeg();
  }

  render() {
    const { kegs, profile, sync } = this.props;
    const { showCreate } = this.state;

    return (
      <section className="keg-list">
        { sync.fetching &&
          <Loader />
        }


        { kegs.map(keg => (
            <Keg key={keg.model.id} {...keg} profile={profile} />
          ))
        }

        {profile && profile.admin && sync.fetched &&
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
      kegsState: kegsStore.getState(),
    };
  }

  componentWillMount() {
    fetchKegs();
  }

  render() {
    // todo - so i wanna keep the data in the store as
    // Immutable Maps, but then for passing to components
    // you *probably* just want JSON. so do we map that out
    // below, or should we override .getState() to actually
    // convert it then?
    // i don't know.
    // OR maybe we just teach the components to use maps.
    return (
      <KegsComponent
        kegs={this.state.kegsState.get('kegs').toArray().map(map => map.toJSON())}
        sync={this.state.kegsState.get('sync').toJSON()}
        {...this.props}
      />
    );
  }
}

export default Container.create(KegsContainer);
