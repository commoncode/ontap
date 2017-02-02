/**
 * BeerSelect component.
 * Select a Beer from a dropdown.
 */

import React from 'react';
import { Container } from 'flux/utils';

import beerSelectStore from '../../stores/beer-select';
import { fetchBeers } from '../../actions/beers';

class BeerSelect extends React.Component {

  static propTypes() {
    return {
      beers: React.PropTypes.array,
      fetching: React.PropTypes.bool,
      value: React.PropTypes.number,
      onChange: React.PropTypes.function,
    };
  }

  constructor(props) {
    super();

    const { value } = props;
    this.state = {
      value: value || -1,
    };

    this.changeHandler = this.changeHandler.bind(this);
  }

  componentWillReceiveProps(props) {
    const { value } = props;
    this.setState({
      value: value || -1,
    });
  }

  changeHandler(evt) {
    this.props.onChange(evt.currentTarget.value);
  }

  render() {
    const { beers, error } = this.props;
    const { value } = this.state;

    return (
      <div className="beer-select">
        <select onChange={this.changeHandler} value={value}>
          <option value={-1} disabled>Select a beer...</option>
          { beers.map(beer => (
            <option key={beer.id} value={beer.id}>{beer.breweryName}: {beer.name}</option>
          )) }
        </select>

        { error && (
          <p className="error">Error fetching beers: { error.message }</p>
        ) }

      </div>
    );
  }

}

class BeerSelectContainer extends React.Component {
  static getStores() {
    return [beerSelectStore];
  }

  static calculateState() {
    return beerSelectStore.getState();
  }

  componentWillMount() {
    fetchBeers();
  }

  render() {
    return <BeerSelect {...this.props} {...this.state} />;
  }
}

export default Container.create(BeerSelectContainer, { withProps: true });
