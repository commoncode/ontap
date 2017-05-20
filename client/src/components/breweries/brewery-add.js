/**
 * BreweryAdd
 * Wrap the edit form to create an add form.
 */

import React from 'react';
import autobind from 'autobind-decorator';

import { createBrewery } from '../../actions/breweries';

import BreweryEdit from './brewery-edit';


const defaultValues = {
  name: '',
  web: '',
  location: '',
  description: '',
  adminNotes: '',
  canBuy: false,
};

@autobind
class BreweryAdd extends BreweryEdit {

  // eslint-disable-next-line class-methods-use-this
  save(evt) {
    evt.preventDefault();
    createBrewery(this.state.model)
    .then((model) => {
      document.location.hash = `/breweries/${model.id}/`;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  delete(evt) {
    evt.preventDefault();
  }

  constructor(props) {
    super(props);
    // pass defaultValues as the model
    this.state.model = defaultValues;
  }

  render() {
    return (
      <div className="view">
        <div className="page-header">
          <div className="page-title">
            Add a Brewery
          </div>
        </div>

        {super.render()}

      </div>
    );
  }
}

export default BreweryAdd;
