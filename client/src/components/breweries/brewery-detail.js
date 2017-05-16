import React from 'react';
import reactPropTypes from 'prop-types';
import { Container } from 'flux/utils';
import autobind from 'autobind-decorator';

import { fetchBrewery } from '../../actions/breweries';
import { breweryModel } from '../../proptypes';
import breweryDetailStore from '../../stores/brewery-detail';
import autoLoader from '../loader/auto-loader';
import { urlify } from '../../util/util';

import BreweryEdit from './brewery-edit';


@autobind
class BreweryDetail extends React.Component {

  constructor(props) {
    super();
    this.state = {
      showEdit: false,
    };
  }

  toggleEdit() {
    this.setState({
      showEdit: !this.state.showEdit,
    });
  }

  render() {
    const { props, state } = this;

    return (
      <div className="brewery-detail view">
        <header className="page-header">
          <h1 className="page-title">
            {props.name}
          </h1>
          <h4>{props.location}</h4>
          <h4>
            <a
              href={urlify(props.web)}
              target="_blank"
              rel="noopener noreferrer"
            >{
              props.web}
            </a>
          </h4>
        </header>
        <p className="brewery-detail__description pre-wrap">
          {props.description}
        </p>

        {props.profile.admin && (
          <p className="brewery-detail__admin-notes pre-wrap">
            {props.adminNotes}
          </p>
        )}

        {props.canBuy && (<p className="brewery-detail__canbuy">
          We can order beers from this brewery.
        </p>)}

        {props.profile.admin && (
          <a onClick={this.toggleEdit}>Edit this Brewery</a>
        )}

        {state.showEdit && (
          <BreweryEdit
            model={props}
            reset={this.toggleEdit}
          />
        )}
      </div>
    );
  }
}


const BreweryDetailLoader = autoLoader(props => props.fetching)(BreweryDetail);

BreweryDetail.propTypes = breweryModel;

class BreweryDetailContainer extends React.Component {
  static getStores() {
    return [breweryDetailStore];
  }

  static calculateState() {
    return breweryDetailStore.getState();
  }

  static propTypes() {
    return {
      breweryId: reactPropTypes.number,
    };
  }

  componentWillMount() {
    fetchBrewery(this.props.breweryId);
  }

  render() {
    return <BreweryDetailLoader {...this.state.model} fetching={this.state.fetching} profile={this.props.profile} />;
  }
}

export default Container.create(BreweryDetailContainer, { withProps: true });
