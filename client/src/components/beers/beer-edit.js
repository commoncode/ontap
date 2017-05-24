/**
 * BeerEdit component.
 * Form for editing a Beer.
 * Pass a Beer as .model to edit existing; pass nothing to create new.
 */

import React from 'react';
import autobind from 'autobind-decorator';

import { updateBeer, createBeer } from '../../actions/beers';
import { nullify } from '../../actions/util';

import Loader from '../loader';
import BrewerySelect from '../breweries/brewery-select';

const defaultValues = {
  name: '',
  breweryId: null,
  variety: '',
  abv: '',
  ibu: '',
  canBuy: false,
  notes: '',
};

@autobind
export default class BeerEdit extends React.Component {
  constructor(props) {
    super();

    // copy props to state.
    // seems reasonable?
    this.state = {
      model: {
        ...defaultValues,
        ...props.model,
      },
    };

    // abv/ibu are nullable, set to empty strings if they are.
    // we coerce them back to null later on if they're not given values.
    if (this.state.model.abv === null) this.state.model.abv = '';
    if (this.state.model.ibu === null) this.state.model.ibu = '';

  }

  inputChangeHandler(evt) {
    this.setState({
      model: Object.assign(this.state.model, {
        [evt.target.name]: evt.target.value,
      }),
    });
  }

  checkboxChangeHandler(evt) {
    this.setState({
      model: Object.assign(this.state.model, {
        [evt.target.name]: evt.target.checked,
      }),
    });
  }

  breweryChangeHandler(breweryId) {
    this.setState({
      model: Object.assign(this.state.model, {
        breweryId,
      }),
    });
  }

  saveAction() {
    // coerce empty string values to null for .abv and .ibu
    // because they're not stored as strings in the db
    const model = nullify(this.state.model, ['abv', 'ibu']);

    if (this.props.model && this.props.model.id) {
      return updateBeer(model);
    }
    return createBeer(model);
  }

  render() {
    const { name, breweryId, abv, ibu, variety, notes, canBuy } = this.state.model;
    const { syncing } = this.props;

    const isNew = !this.props.model || !this.props.model.id;

    return (
      <div className="beer-edit edit-form">

        <h1>{ isNew ? 'Add a Beer' : 'Edit Beer' }</h1>

        <label htmlFor="name">Beer Name *</label>
        <input
          type="text"
          name="name"
          placeholder="Pot Kettle Black"
          onChange={this.inputChangeHandler}
          value={name}
        />

        <label htmlFor="breweryId">Brewery</label>
        <BrewerySelect onChange={this.breweryChangeHandler} value={breweryId} />

        <label htmlFor="variety">Variety</label>
        <input
          name="variety"
          placeholder="South Pacific Porter "
          onChange={this.inputChangeHandler}
          value={variety}
        />

        <label htmlFor="abv">ABV (%)</label>
        <input
          name="abv"
          placeholder="6.0"
          onChange={this.inputChangeHandler}
          value={abv}
        />

        <label htmlFor="ibu">IBU</label>
        <input
          name="ibu"
          placeholder="50"
          onChange={this.inputChangeHandler}
          value={ibu}
        />

        <label htmlFor="canBuy">Confirmed Distributor</label>
        <input
          type="checkbox"
          name="canBuy"
          onChange={this.checkboxChangeHandler}
          checked={canBuy}
        />

        <label htmlFor="notes">Notes</label>
        <textarea
          placeholder="Add some tasting notes or a useful link"
          name="notes"
          onChange={this.inputChangeHandler}
          value={notes}
        />

        {!syncing ? <button className="btn" onClick={this.saveAction}>Save</button> : <Loader />}

      </div>
    );
  }

}

