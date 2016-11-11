/**
 * Tap Change component.
 * User can change the Keg on a Tap.
 */

import React from 'react';
import { Container } from 'flux/utils';

import tapChangeStore from '../../stores/tap-change';
import { fetchTapWithKegs, changeTap } from '../../actions/taps';

import Loader from '../loader';

// return the passed string or null if empty.
function stringOrNull(str) {
  return str === '' ? null : str;
}

// same as above but convert to number
function numberOrNull(str) {
  return str === '' ? null : Number(str);
}

class TapChange extends React.Component {

  constructor() {
    super();
    this.state = {
      tapped: '',
      untapped: '',
      kegId: null,
    };

    this.selectChangeHandler = this.selectChangeHandler.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.saveAction = this.saveAction.bind(this);
  }

  selectChangeHandler(evt) {
    this.setState({
      kegId: evt.target.value,
    });
  }

  inputChangeHandler(evt) {
    this.setState(Object.assign(this.state, {
      [evt.target.name]: evt.target.value,
    }));
  }

  saveAction() {
    const { tapped, untapped, kegId } = this.state;

    const payload = {
      tapId: this.props.tap.id,
      tapped: stringOrNull(tapped),
      untapped: stringOrNull(untapped),
      kegId: numberOrNull(kegId),
    };

    changeTap(payload)
    .then(() => {
      console.log('done');
    });
  }

  render() {
    const { kegs, tap, fetching } = this.props;

    const { tapped, untapped, kegId } = this.state;

    if (!tap || fetching) {
      return <Loader />;
    }

    return (
      <div className="tap-change">
        <h3>{tap.name}</h3>

        <h4>
          {tap.Keg ? `${tap.Keg.beerName} by ${tap.Keg.breweryName}` : 'No Service'}
        </h4>


        <h5>Change this Keg</h5>

        <label htmlFor="kegId">Keg</label>
        <select onChange={this.selectChangeHandler} value={kegId} name="kegId">
          <option value="">No Service (Untap current keg)</option>
          <option disabled="true">-----</option>
          { kegs.map(keg => (
            <option
              key={keg.id}
              value={keg.id}
              disabled={keg.Tap}
            >{keg.beerName}</option>
          )) }
        </select>

        <label htmlFor="tapped">New Keg Tapped Date</label>
        <input name="tapped" value={tapped} onChange={this.inputChangeHandler} />

        <label htmlFor="untapped">Old Keg Untapped Date</label>
        <input name="untapped" value={untapped} onChange={this.inputChangeHandler} />

        <button onClick={this.saveAction}>Save</button>

      </div>
    );
  }
}


class TapChangeContainer extends React.Component {
  static propTypes() {
    return {
      tapId: React.PropTypes.number,
    };
  }

  static getStores() {
    return [tapChangeStore];
  }

  static calculateState() {
    return tapChangeStore.getState();
  }

  componentWillMount() {
    fetchTapWithKegs(this.props.tapId);
  }

  render() {
    return <TapChange kegs={this.state.kegs} tap={this.state.tap} profile={this.state.profile} />
  }
}

export default Container.create(TapChangeContainer, { withProps: true });
