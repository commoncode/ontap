/**
 * Tap.
 * Displays a Tap, and if the Tap has a Keg, we'll show that too.
 */

import React from 'react';
import reactPropTypes from 'prop-types';
import branch from 'recompose/branch';
import renderComponent from 'recompose/renderComponent';

import * as propTypes from '../../proptypes/';
import { dayMonth } from '../../util/date';


const Tap = (props) => {
  const { model, profile } = props;
  const { name, id, Keg } = model;
  const { Beer } = Keg;
  const { Brewery } = Beer;
  return (
    <article className="tap">
      <div className="tap-name">
        {name}
      </div>
      <div className="tap-keg">
        <h2 className="beer-name">{Beer.name}</h2>
        <h3 className="variety-by-brewery">
          {Beer.variety && `${Beer.variety} `}
          by <span>
            <a href={`/#/breweries/${Brewery.id}`}>{Brewery.name}</a>
          </span>
        </h3>
        <p className="tapped-date">Tapped {dayMonth(Keg.tapped)}</p>
      </div>

      {profile && profile.admin &&
        <div className="tap-admin">
          <a href={`/#/taps/${id}/`} className="btn">Change Tap</a>
        </div>
      }
    </article>
  );
};

Tap.propTypes = {
  model: reactPropTypes.shape(propTypes.kegModel),
  profile: reactPropTypes.shape(propTypes.profile),
};

const Dry = props => (
  <article className="tap no-service">
    <div className="tap-name">
      {props.model.name}
    </div>
    <div className="tap-keg">
      <header>
        <h2 className="beer-name">No Service</h2>
      </header>
    </div>
    {props.profile && props.profile.admin &&
      <div className="tap-admin">
        <a href={`/#/taps/${props.model.id}/`} className="btn">Change Tap</a>
      </div>
    }
  </article>
);

Dry.propTypes = {
  model: reactPropTypes.shape(propTypes.kegModel),
  profile: reactPropTypes.shape(propTypes.profile),
};

// switch Dry/Tap based on whether there's a Keg
export default branch(
  props => !props.model.Keg,
  renderComponent(Dry),
  Component => Component
)(Tap);
