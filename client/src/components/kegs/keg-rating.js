/**
 * Keg-Rating.
 * Show a Keg's current score.
 */

import React from 'react';
import * as propTypes from '../../proptypes';

const ratingValueToEmoji = new Map();
ratingValueToEmoji.set(1, 'happy');
ratingValueToEmoji.set(0, 'meh');
ratingValueToEmoji.set(-1, 'sad');

const KegRating = (props) => {
  if (!props.ratings) return null;

  const valueCounts = new Map();
  props.ratings.forEach((rating) => {
    const { value } = rating;
    const currentCount = valueCounts.get(value) || 0;
    valueCounts.set(value, currentCount + 1);
  });

  return (
    <div className="keg-rating">

      <div className="rating">
        { valueCounts.get(1) || 0 }
        <div className="icon emoji-happy" />
      </div>

      <div className="rating">
        { valueCounts.get(0) || 0}
        <div className="icon emoji-meh" />
      </div>

      <div className="rating">
        { valueCounts.get(-1) || 0}
        <div className="icon emoji-sad" />
      </div>

    </div>
  );
};

KegRating.propTypes = {
  ratings: propTypes.ratings,
};

export default KegRating;
