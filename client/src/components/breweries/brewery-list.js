/**
 * BreweryList
 * List the breweries. obviously.
 */

import React from 'react';
import propTypes from 'prop-types';
import { Container } from 'flux/utils';

import breweryListStore from '../../stores/brewery-list';
import { fetchBreweries } from '../../actions/breweries';
import { breweryModel } from '../../proptypes';

import Loader from '../loader';
import BreweryListItem from './brewery-list-item';

const BreweryList = props => (props.fetching ? <Loader /> : (
  <div className="brewery-list view">
    <header className="page-header">
      <h1 className="page-title">
        Breweries.
      </h1>
    </header>

    <div>
      {(props.models || []).map(brewery => (
        <BreweryListItem key={brewery.id} {...brewery} />
      ))}
    </div>
  </div>
));

BreweryList.propTypes = {
  models: propTypes.arrayOf(propTypes.shape(breweryModel)),
  fetching: propTypes.bool,
};

class BreweryListContainer extends React.Component {
  static getStores() {
    return [breweryListStore];
  }

  static calculateState() {
    return breweryListStore.getState();
  }

  componentWillMount() {
    fetchBreweries();
  }

  render() {
    return <BreweryList {...this.state} />;
  }
}

export default Container.create(BreweryListContainer);
