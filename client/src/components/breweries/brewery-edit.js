/**
 * BreweryEdit
 */

import React from 'react';
import autobind from 'autobind-decorator';

import { updateBrewery, deleteBrewery } from '../../actions/breweries';

import EditForm from '../generic/edit-form';

@autobind
class BreweryEdit extends EditForm {
  save(evt) {
    evt.preventDefault();
    updateBrewery(this.props.model.id, this.state.model)
    .then(() => {
      this.props.reset(); // hide this form
    });
  }

  delete(evt) {
    evt.preventDefault();
    deleteBrewery(this.props.model.id)
    .then(() => {
      document.location.hash = '/breweries';
    });
  }

  render() {
    const { state } = this;

    return (
      <div className="brewery-edit edit-form">

        <form onSubmit={this.save}>

          <label htmlFor="name">Name</label>
          <input
            name="name"
            value={state.model.name}
            onChange={this.inputChangeHandler}
          />

          <label htmlFor="name">Web</label>
          <input
            name="web"
            value={state.model.web}
            onChange={this.inputChangeHandler}
            placeholder="brewery.com"
          />

          <label htmlFor="name">Location</label>
          <input
            name="location"
            value={state.model.location}
            onChange={this.inputChangeHandler}
            placeholder="Collingwood, VIC"
          />

          <label htmlFor="name">Description</label>
          <textarea
            name="description"
            value={state.model.description}
            onChange={this.inputChangeHandler}
          />

          <label htmlFor="name">Admin Notes</label>
          <textarea
            name="adminNotes"
            value={state.model.adminNotes}
            onChange={this.inputChangeHandler}
            placeholder="Name of our sales rep and contact details; what payment arrangement do we have; how long does a delivery usually take, etc."
          />

          <label htmlFor="canBuy">Confirmed distributor</label>
          <input
            name="canBuy"
            value={state.model.canBuy}
            onChange={this.checkboxChangeHandler}
            type="checkbox"
          />


          <button className="btn" type="submit">Save</button>
          <button className="btn" onClick={this.props.reset}>Cancel</button>

        </form>

        {state.model.id && (
          <div className="edit-form__delete">
            <a className="btn-delete" onClick={this.toggleDelete}>
              Delete Brewery
            </a>
            { this.state.showDelete && (
              <a className="btn-delete-confirm" onClick={this.delete}>For real, get rid of it.</a>
            )}
          </div>
        )}

      </div>
    );
  }
}

export default BreweryEdit;
