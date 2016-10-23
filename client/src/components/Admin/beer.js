/**
 * Beer Edit component.
 * Pass in a Beer model as props to edit an existing row,
 * or pass no props to create a new one.
 */

import React from 'react';
import classnames from 'classnames/bind';

import tapActions from '../../actions/taps';

import styles from './admin.scss';

const classes = classnames.bind(styles);

class EditBeer extends React.Component {

  static propTypes() {
    return {
      id: React.PropTypes.number,
    };
  }

  constructor(props) {
    super();

    this.state = {
      model: Object.assign({
        tapName: '',
        breweryName: '',
        beerName: '',
        tapped: '',
        abv: '',
        notes: '',
        active: true,
      }, props),
    };

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.checkboxChangeHandler = this.checkboxChangeHandler.bind(this);
    this.saveAction = this.saveAction.bind(this);
  }

  // this will probably cause headaches at some point
  componentWillReceiveProps(props) {
    this.setState = {
      model: Object.assign({}, props),
    };
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
    // if we've got an id, we're saving an existing beer
    // if we don't, we're adding a new one.
    if (this.props.id) {
      tapActions.updateBeer(this.state.model);
    } else {
      tapActions.createBeer(this.state.model);
    }
  }

  render() {
    const { tapName, beerName, breweryName, abv, tapped, notes, active } = this.state.model;

    return (
      <div className={`admin-beer ${classes(['admin-beer'])}`}>

        <label htmlFor="tapName">Tap Name</label>
        <input
          name="tapName"
          placeholder="tapName"
          onChange={this.inputChangeHandler}
          value={tapName}
        />

        <label htmlFor="breweryName">Brewery Name</label>
        <input
          name="breweryName"
          placeholder="breweryName"
          onChange={this.inputChangeHandler}
          value={breweryName}
        />

        <label htmlFor="beerName">Beer Name</label>
        <input
          name="beerName"
          placeholder="beerName"
          onChange={this.inputChangeHandler}
          value={beerName}
        />

        <label htmlFor="abv">ABV (%)</label>
        <input
          name="abv"
          placeholder="abv"
          onChange={this.inputChangeHandler}
          value={abv}
        />

        <label htmlFor="tapped">Date Tapped (YYYY-MM-DD)</label>
        <input
          name="tapped"
          placeholder="tapped"
          onChange={this.inputChangeHandler}
          value={tapped}
        />

        <label htmlFor="notes">Notes</label>
        <textarea
          name="notes"
          placeholder="notes"
          onChange={this.inputChangeHandler}
          value={notes}
        />

        <label htmlFor="active">
          <input
            type="checkbox"
            name="active"
            placeholder="active"
            onChange={this.checkboxChangeHandler}
            checked={active}
          />
          Currently on tap
        </label>

        <button onClick={this.saveAction}>Save</button>
      </div>
    );
  }

}

export default EditBeer;
