import React from 'react';
import classnames from 'classnames/bind';
import { Container } from 'flux/utils';

import Loader from '../Loader';

import Tap from './Tap';
import styles from './current-taps.css';

import tapsActions from '../../actions/taps';
import tapsStore from '../../stores/taps';

const classes = classnames.bind(styles);

const CurrentTapsComponent = props => (
  <section className={classes(['on-tap-list'])}>
    {props.taps.fetching && <Loader />}

    {props.taps.fetched &&
      props.taps.data.map(tap => <Tap key={tap.id} {...tap} profile={props.profile} />)
    }
  </section>
);

CurrentTapsComponent.propTypes = {
  taps: React.PropTypes.object,
};


class CurrentTapsContainer extends React.Component {
  static getStores() {
    return [tapsStore];
  }

  static calculateState() {
    return {
      taps: tapsStore.getState(),
    };
  }

  componentWillMount() {
    tapsActions.fetchTaps();
  }

  render() {
    return (
      <CurrentTapsComponent
        taps={this.state.taps}
        {...this.props}
      />
    );
  }
}

export default Container.create(CurrentTapsContainer);
