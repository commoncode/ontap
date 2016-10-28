/**
 * Kegs component/container
 *
 * List of all the Kegs.
 */

import React from 'react';
import { Container } from 'flux/utils';

import { fetchKegs } from '../../actions/kegs';
import kegsStore from '../../stores/kegs';
import * as propTypes from '../../proptypes/';

import KegListItem from './keg-list-item';
import Loader from '../loader/';


class KegsComponent extends React.Component {

  static propTypes() {
    return {
      profile: propTypes.profile,
      kegs: propTypes.kegs,
      sync: propTypes.sync,
    };
  }

  constructor() {
    super();
    this.state = {
      showNew: false,
    };

    this.toggleShowNew = this.toggleShowNew.bind(this);
  }

  toggleShowNew() {
    this.setState({
      showNew: !this.state.showNew,
    });
  }

  render() {
    const { kegs, profile, sync } = this.props;

    return (
      <section className="keg-list">
        { sync.fetching && <Loader /> }

        { kegs.map(keg => <KegListItem {...keg} profile={profile} />) }

        { profile && profile.admin && sync.fetched &&
          <button className="btn-new-keg" onClick={this.toggleShowNew}>Add a Keg +</button>
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
