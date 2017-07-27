/**
 * BrewerySelect component.
 * Select a Brewery from a dropdown of all breweries.
 */

import React from 'react';
import { Container } from 'flux/utils';

import brewerySelectStore from '../../stores/brewery-select';
import { fetchBreweries } from '../../actions/breweries';

import ModelSelect from '../generic/model-select';

class BrewerySelectContainer extends React.Component {
  static getStores() {
    return [brewerySelectStore];
  }

  static calculateState() {
    return brewerySelectStore.getState();
  }

  componentWillMount() {
    fetchBreweries();
  }

  render() {
    return <ModelSelect {...this.props} {...this.state} />;
  }
}

export default Container.create(BrewerySelectContainer, { withProps: true });
