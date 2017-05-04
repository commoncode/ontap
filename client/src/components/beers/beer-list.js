/**
 * Beers component/container
 *
 * Lists all the Beers.
 * Beers are things we can buy
 */

import React from 'react';
import { Container } from 'flux/utils';

import { fetchBeers, showAddBeer } from '../../actions/beers';
import beersStore from '../../stores/beers';
import * as propTypes from '../../proptypes/';
import { replaceQueryParams } from '../router';

import Loader from '../loader/';
import BeerListItem from './beer-list-item';
import BeerEdit from './beer-edit';
import ToggleButton from '../generic/toggle-button';

const SEARCHABLE_PROPS = ['name', 'breweryName', 'variety'];

// Update the ?q=foo value in the current url.
// Uses replace so it doesn't create an extra history state.
function updatePathQueryString(evt) {
  replaceQueryParams({
    q: evt.target.value,
  });
}

// beer filter functions
const beerFilters = {
  all(beer) {
    return beer;
  },
  available(beer) {
    return beer.canBuy;
  },
  unavailable(beer) {
    return !beer.canBuy;
  },
};

// todo - use the react compose branch thing to handle sync.fetching
class BeerList extends React.Component {

  constructor() {
    super();

    this.state = {
      adding: false,
      filterQuery: '',
      activeFilterName: 'available',
    };

    this.setFilterQuery = this.setFilterQuery.bind(this);
    this.setFilter = this.setFilter.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      filterQuery: (props.queryParams && props.queryParams.q) || '',
    });
  }

  setFilterQuery(evt) {
    this.setState({
      filterQuery: evt.target.value,
    });
  }

  setFilter(activeFilterName) {
    this.setState({
      activeFilterName,
    });
  }

  render() {
    const { beers, sync, create, profile } = this.props;
    const { filterQuery, activeFilterName } = this.state;

    if (sync.fetching) return <Loader />;

    const filteredBeers = beers.filter(beerFilters[activeFilterName]);
    const queryFilteredBeers = !filterQuery ? filteredBeers : filteredBeers.filter((beer) => {
      const searchString = SEARCHABLE_PROPS.map(key => beer[key]).join();
      return searchString.match(new RegExp(filterQuery, 'gi'));
    });

    return (
      <div>
        <section className="beer-list-view">
          <header className="page-header">
            <h1 className="page-title">Beers.</h1>
          </header>

          <div className="button-group">

            <ToggleButton
              clickHandler={this.setFilter}
              value="available"
              title="Available"
              activeValue={activeFilterName}
            />
            <ToggleButton
              clickHandler={this.setFilter}
              value="unavailable"
              title="Unavailable"
              activeValue={activeFilterName}
            />
            <ToggleButton
              clickHandler={this.setFilter}
              value="all"
              title="All"
              activeValue={activeFilterName}
            />
          </div>

          <div className="list-search">
            <input
              type="search"
              onChange={this.setFilterQuery}
              onBlur={updatePathQueryString}
              value={filterQuery}
              placeholder="search..."
            />
          </div>

          <section className="beer-list">
            { queryFilteredBeers.map(beer => (
              <BeerListItem key={beer.id} profile={profile} {...beer} />)
            ) }
          </section>

          { profile && profile.id && (
            <div className="beer-list-add-beer">

              { !create.showForm ?
                <button className="btn-add-beer" onClick={showAddBeer} >Add a Beer +</button>
                :
                <BeerEdit syncing={create.syncing} />
              }
            </div>

          )}

        </section>
      </div>
    );
  }
}

BeerList.propTypes = {
  beers: propTypes.beers,
  create: React.PropTypes.object,
  profile: propTypes.profile,
  sync: propTypes.sync,
};


class BeerListContainer extends React.Component {
  static getStores() {
    return [beersStore];
  }

  static calculateState() {
    return {
      beersState: beersStore.getState(),
    };
  }

  componentWillMount() {
    fetchBeers();
  }

  render() {
    // todo - when's the best time to convert our store Immutable data
    // to regular Arrays and JSON? Ever? Or should components just expect
    // and handle Immutables...?
    return (
      <BeerList
        beers={this.state.beersState.get('beers').toArray()}
        sync={this.state.beersState.get('sync').toJSON()}
        create={this.state.beersState.get('create').toJSON()}
        {...this.props}
      />
    );
  }
}

export default Container.create(BeerListContainer);
