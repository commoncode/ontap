/**
 * KegSummary
 * Quick overview of a Keg.
 * What tap it's on, date tapped, ratings, notes, etc.
 */

import React from 'react';
import { kegModel } from '../../proptypes';

import { dayMonth } from '../../util/date';

import KegRating from './keg-rating';

const KegSummary = props => (
  <div className="keg-summary-view">
    <div className="keg-summary">
      {props.Tap && (
        <p className="now-on-tap">
          Pouring now on {props.Tap.name}.
        </p>
      )}

      {props.tapped &&
        <p className="tapped">
          {props.tapped && `Tapped ${dayMonth(props.tapped)}`}
          {props.tapped && props.untapped && ` - ${dayMonth(props.untapped)}`}
        </p>
      }

      { props.notes &&
        <p className="notes">
          {props.notes}
        </p>
      }
    </div>

    <KegRating ratings={props.Ratings} kegId={props.id} />


  </div>
);

KegSummary.propTypes = kegModel;

export default KegSummary;
