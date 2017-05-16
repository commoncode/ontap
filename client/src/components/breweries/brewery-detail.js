import React from 'react';
import { Container } from 'flux/utils';

import { fetchBrewery } from '../../actions/breweries';
import { breweryModel } from '../../proptypes';
import breweryDetailStore from '../../stores/brewery-detail';
import autoLoader from '../loader/auto-loader';


const BreweryDetail = autoLoader(props => props.fetching)(props => (
  <div className="brewery-detail view">
    <header className="page-header">
      <h1 className="page-title">
        {props.name}
        <small>{props.location}</small>
      </h1>
    </header>
    <p className="brewery-detail__description">
      {props.description}
    </p>
    {props.canBuy && (<p className="brewery-detail__canbuy">
      We can order beers from this brewery.
    </p>)}
  </div>
));

BreweryDetail.propTypes = breweryModel;

class BreweryDetailContainer extends React.Component {
  static getStores() {
    return [breweryDetailStore];
  }

  static calculateState() {
    return breweryDetailStore.getState();
  }

  static propTypes() {
    return {
      breweryId: React.PropTypes.number,
    };
  }

  componentWillMount() {
    fetchBrewery(this.props.breweryId);
  }

  render() {
    return <BreweryDetail {...this.state.model} fetching={this.state.fetching} />;
  }
}

export default Container.create(BreweryDetailContainer, { withProps: true });
