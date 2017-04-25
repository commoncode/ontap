/**
 * KegList.
 *
 * Lists all the Kegs; current, past, future.
 * Used for 'Now on Tap' view.
 */

import React from 'react';
import { Container } from 'flux/utils';

import { fetchKegs } from '../../actions/kegs';
import kegsStore from '../../stores/kegs';
import * as propTypes from '../../proptypes/';

import KegListItem from './keg-list-item';
import Loader from '../loader/';
import ToggleButton from '../generic/toggle-button';


// filter functions
const filters = {
  all(keg) {
    return keg;
  },
  ontap(keg) {
    return keg.tapped !== null && keg.untapped === null;
  },
  untapped(keg) {
    return keg.tapped === null;
  },
  finished(keg) {
    return keg.untapped !== null;
  },
};

class KegList extends React.Component {

  constructor() {
    super();
    this.state = {
      activeFilterName: 'ontap',
    };
    this.setFilter = this.setFilter.bind(this);
  }

  setFilter(activeFilterName) {
    this.setState({
      activeFilterName,
    });
  }

  render() {
    const { kegs, sync, profile} = this.props;
    const { activeFilterName } = this.state;

    return (
      <section className="keg-list">
        { sync.fetching && <Loader /> }

        { !sync.fetching && (

          <div className="keg-list-filter button-group">
            <ToggleButton
              clickHandler={this.setFilter}
              value="ontap"
              title="Now On Tap"
              activeValue={activeFilterName}
            />
            <ToggleButton
              clickHandler={this.setFilter}
              value="untapped"
              title="Up Next"
              activeValue={activeFilterName}
            />
            <ToggleButton
              clickHandler={this.setFilter}
              value="finished"
              title="Finished"
              activeValue={activeFilterName}
            />
            <ToggleButton
              clickHandler={this.setFilter}
              value="all"
              title="Show All"
              activeValue={activeFilterName}
            />
          </div>

        )}

        { kegs.filter(filters[activeFilterName]).map(keg => <KegListItem key={keg.id} {...keg} profile={profile} />) }

      </section>
    );
  }
}

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
    return (
      <KegList
        kegs={this.state.kegsState.get('kegs').toArray()}
        sync={this.state.kegsState.get('sync').toJSON()}
        {...this.props}
      />
    );
  }
}

export default Container.create(KegListContainer);
