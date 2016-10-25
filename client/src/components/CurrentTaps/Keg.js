import React from 'react';
import classnames from 'classnames/bind';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';

import styles from './current-taps.css';
import { dayMonth } from '../../util/date';

import { toggleEditKeg } from '../../actions/kegs';

import KegEdit from '../Admin/KegEdit';

function calcStandardDrinks(abv, litres = 0.500) {
  // http://www.alcohol.gov.au/internet/alcohol/publishing.nsf/content/standard
  const ethanol = 0.789;
  const result = litres * abv * ethanol;
  return Math.round(result * 100) / 100;
}

const classes = classnames.bind(styles);

class Keg extends React.Component {

  static propTypes() {
    return {
      model: React.PropTypes.object,
      standardDrinks: React.PropTypes.number,
      editing: React.PropTypes.boolean,
      syncing: React.PropTypes.boolean,
      profile: React.PropTypes.object,
    };
  }

  constructor() {
    super();
    this.state = {
      editing: false,
    };

    this.toggleEdit = this.toggleEdit.bind(this);
  }

  toggleEdit() {
    toggleEditKeg(this.props.model.id);
  }

  render() {
    const { standardDrinks, editing, syncing, profile, model } = this.props;
    const { abv, beerName, breweryName, notes, tapped } = model;

    return (
      <div className={`keg ${classes(['keg'])}`}>
        <header>
          <div className={classes(['title'])}>
            <h2 className={classes(['beer-name'])}>
              {beerName}
            </h2>
            <h3 className={classes(['brewery-name'])}>
              {breweryName}
            </h3>
          </div>
          <div className={classes(['meta'])}>
            <p className={classes(['abv'])}>
              {`${abv}%`}
              <small className={classes(['std'])}>{` (${standardDrinks} SD)` } </small>
            </p>
            <p className={classes(['tapped'])}>
              {tapped && `Tapped ${dayMonth(tapped)}`}
            </p>

            {profile && profile.admin &&
              <a className={classes(['btn-edit'])} onClick={this.toggleEdit}>edit</a>
            }
          </div>

        </header>
        <p className={classes(['notes'])}>
          {notes}
        </p>

        {editing &&
          <KegEdit model={model} syncing={syncing} />
        }
      </div>
    );
  }
}

const enhance = compose(
  withProps(({ model }) => ({
    standardDrinks: calcStandardDrinks(model.abv),
  })),
);

export default enhance(Keg);
