/**
 * BreweryList
 * List the breweries. obviously.
 */

import React from 'react';
import propTypes from 'prop-types';
import { Container } from 'flux/utils';

import breweryListStore from '../../stores/brewery-list';
import profileStore from '../../stores/profile';
import { fetchBreweries } from '../../actions/breweries';
import { breweryModel, userModel } from '../../proptypes';

import Loader from '../loader';
import BreweryListItem from './brewery-list-item';

const BreweryList = props => (props.fetching ? <Loader /> : (
  <div className="brewery-list view">
    <header className="page-header">
      <h1 className="page-title">
        Breweries.
      </h1>
    </header>

    {props.profile.admin && <a className="list-add-link" href="/#/breweries/add">Add a Brewery &raquo;</a>}

    {(props.models).map(brewery => (
      <BreweryListItem key={brewery.id} {...brewery} />
    ))}
  </div>
));

BreweryList.propTypes = {
  models: propTypes.arrayOf(propTypes.shape(breweryModel)),
  fetching: propTypes.bool,
  profile: propTypes.shape(userModel),
};

class BreweryListContainer extends React.Component {
  static getStores() {
    return [breweryListStore, profileStore];
  }

  static calculateState() {
    return {
      breweries: breweryListStore.getState(),
      profile: profileStore.getState().data,
    };
  }

  componentWillMount() {
    fetchBreweries();
  }

  render() {
    return <BreweryList {...this.state.breweries} profile={this.state.profile} />;
  }
}

export default Container.create(BreweryListContainer);
