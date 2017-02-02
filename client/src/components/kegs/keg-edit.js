/**
 * KegEdit component.
 * Form for editing a Keg (pass Keg model as props).
 * Instantiate with no props to create new Kegs.
 */

import React from 'react';

import { updateKeg, createKeg } from '../../actions/kegs';
import Loader from '../loader/';
import BeerSelect from '../beers/beer-select';

class KegEdit extends React.Component {

  static propTypes() {
    return {
      model: React.PropTypes.object,
      syncing: React.PropTypes.bool,
      successHandler: React.PropTypes.func,
    };
  }

  constructor(props) {
    super();

    // copy the props to the state so we can edit it.
    // i guess that's a reasonable enough pattern, right?
    // todo - stop it from overwriting empty strings with nulls so
    // react doesn't cry
    this.state = {
      model: Object.assign({
        tapped: '',
        untapped: '',
        notes: '',
        beerId: null,
      }, props.model),
    };

    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.checkboxChangeHandler = this.checkboxChangeHandler.bind(this);
    this.saveAction = this.saveAction.bind(this);
    this.beerChangeHandler = this.beerChangeHandler.bind(this);
  }

  // i think this potentially could cause headaches.
  // if a props change happens you'll overwrite your local state.
  // guess if it ever happens we'll decide what to do about it then.
  componentWillReceiveProps(props) {
    this.setState({
      model: Object.assign({}, props),
    });
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

  beerChangeHandler(beerId) {
    this.setState({
      model: Object.assign(this.state.model, {
        beerId,
      }),
    });
  }

  saveAction() {
    // if we've got an id, we're saving an existing keg
    // if we don't, we're adding a new one.
    if (this.props.model && this.props.model.id) {
      return updateKeg(this.state.model)
      .then(this.props.successHandler);
    }

    // new keg. create and redirect.
    return createKeg(this.state.model)
    .then((keg) => {
      document.location.hash = `/kegs/${keg.id}/`;
    });
  }

  render() {
    const { tapped, untapped, notes, beerId } = this.state.model;
    const { syncing } = this.props;
    const isNew = !this.props.model || !this.props.model.id;

    return (
      <div className="keg-edit edit-form">

        {isNew && <h1>Add a New Keg</h1>}

        <label htmlFor="beerId">Beer</label>
        <BeerSelect onChange={this.beerChangeHandler} value={beerId} />

        <label htmlFor="notes">Keg Notes</label>
        <textarea
          name="notes"
          placeholder="notes"
          onChange={this.inputChangeHandler}
          value={notes}
        />

        {!isNew && <div>
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
        </div> }

        {!syncing ? <button onClick={this.saveAction}>Save</button> : <Loader />}

      </div>
    );
  }

}

export default KegEdit;
