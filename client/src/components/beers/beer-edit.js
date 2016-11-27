/**
 * BeerEdit component.
 * Form for editing a Beer.
 * Pass a Beer as .model to edit existing; pass nothing to create new.
 */

import React from 'react';

import { updateBeer, createBeer } from '../../actions/beers';

import Loader from '../loader';

const defaultValues = {
  name: '',
  breweryName: '',
  variety: '',
  abv: '',
  ibu: '',
  canBuy: false,
  notes: '',
};

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

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.checkboxChangeHandler = this.checkboxChangeHandler.bind(this);
    this.saveAction = this.saveAction.bind(this);
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

  saveAction() {
    if (this.props.model && this.props.model.id) {
      return updateBeer(this.state.model);
    }
    return createBeer(this.state.model);
  }

  render() {
    const { name, breweryName, abv, ibu, variety, notes, canBuy } = this.state.model;
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

        <label htmlFor="breweryName">Brewery Name</label>
        <input
          name="breweryName"
          placeholder="Yeastie Boys"
          onChange={this.inputChangeHandler}
          value={breweryName}
        />

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

        {!syncing ? <button onClick={this.saveAction}>Save</button> : <Loader />}

      </div>
    );
  }

}

