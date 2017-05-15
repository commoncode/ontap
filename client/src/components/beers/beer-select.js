/**
 * BeerSelect component.
 * Select a Beer from a dropdown of all beers.
 */

import React from 'react';
import { Container } from 'flux/utils';

import beerSelectStore from '../../stores/beer-select';
import { fetchBeers } from '../../actions/beers';

import ModelSelect from '../generic/model-select';

class BeerSelectContainer extends React.Component {
  static getStores() {
    return [beerSelectStore];
  }

  static calculateState() {
    const state = Object.assign({}, beerSelectStore.getState());
    state.models = state.models.map(model => ({
      id: model.id,
      name: `${model.name} (${model.Brewery.name})`,
    }));
    return state;
  }

  componentWillMount() {
    fetchBeers();
  }

  render() {
    return <ModelSelect {...this.props} {...this.state} />;
  }
}

export default Container.create(BeerSelectContainer, { withProps: true });
