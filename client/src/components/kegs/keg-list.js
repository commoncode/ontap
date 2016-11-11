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

import Keg from './keg';
import Loader from '../loader/';


const KegList = (props) => {
  const { kegs, sync } = props;

  return (
    <section className="keg-list">
      { sync.fetching && <Loader /> }

      { kegs.map(keg => <Keg key={keg.model.id} {...keg.model} />) }

    </section>
  );
};

KegList.propTypes = {
  kegs: propTypes.kegs,
  sync: propTypes.sync,
};


class KegListContainer extends React.Component {
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
      <KegList
        kegs={this.state.kegsState.get('kegs').toArray().map(map => map.toJSON())}
        sync={this.state.kegsState.get('sync').toJSON()}
        {...this.props}
      />
    );
  }
}

export default Container.create(KegListContainer);
