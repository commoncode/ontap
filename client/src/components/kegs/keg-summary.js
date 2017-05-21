/* eslint-disable no-nested-ternary */

/**
 * KegSummary
 * Quick overview of a Keg.
 * What tap it's on, date tapped, ratings, notes, etc.
 */

import React from 'react';
import moment from 'moment';

import { kegModel } from '../../proptypes';

import KegSummaryCheers from './keg-summary-cheers';

const KegSummary = props => (
  <div className="keg-summary-view">
    <div className="keg-summary">
      <p className="tapped">
        {props.tapped ? (
          props.untapped ? (
            `Tapped from ${moment(props.tapped).format('MMM Do')}
            to ${moment(props.untapped).format('MMM Do')}
            (${moment(props.untapped).diff(props.tapped, 'days')} days)`
          ) : (
            `Tapped ${moment(props.tapped).fromNow()}`
          )
        ) : (
          'This keg hasn\'t been tapped yet'
        )}
      </p>

      { props.notes && (
        <p className="keg-notes">
          {props.notes}
        </p>
      )}

    </div>

    <KegSummaryCheers {...props} />

  </div>
);

KegSummary.propTypes = kegModel;

export default KegSummary;
