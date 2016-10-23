/**
 * KegEdit component.
 * Mount with no props to create a new Keg,
 * pass in a Keg model as props to update existing.
 */

import React from 'react';
import classnames from 'classnames/bind';

import tapActions from '../../actions/taps';

import styles from './admin.scss';

const classes = classnames.bind(styles);

class KegEdit extends React.Component {

  static propTypes() {
    return {
      id: React.PropTypes.number,
    };
  }

  constructor(props) {
    super();

    this.state = {
      model: Object.assign({
        breweryName: '',
        beerName: '',
        tapped: '',
        abv: '',
        notes: '',
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

  // deprecated but i'm leaving it here because
  // i just reckon i'll need it somewhere else.
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
    const { beerName, breweryName, abv, tapped, untapped, notes } = this.state.model;

    return (
      <div className={`keg-edit ${classes(['keg-edit'])}`}>

        <label htmlFor="beerName">Beer Name</label>
        <input
          name="beerName"
          placeholder="beerName"
          onChange={this.inputChangeHandler}
          value={beerName}
        />

        <label htmlFor="breweryName">Brewery Name</label>
        <input
          name="breweryName"
          placeholder="breweryName"
          onChange={this.inputChangeHandler}
          value={breweryName}
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

        <label htmlFor="untapped">Date Untapped (YYYY-MM-DD)</label>
        <input
          name="untapped"
          placeholder="untapped"
          onChange={this.inputChangeHandler}
          value={untapped}
        />

        <label htmlFor="notes">Notes</label>
        <textarea
          name="notes"
          placeholder="notes"
          onChange={this.inputChangeHandler}
          value={notes}
        />

        <button onClick={this.saveAction}>Save</button>
      </div>
    );
  }

}

export default KegEdit;
