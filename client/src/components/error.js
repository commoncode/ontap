/**
 * Error component.
 * Display an error. Mostly for use with fetch.
 */

import React from 'react';

export default (props) => {
  if (!props) return null;

  return (
    <div className="error">
      { props.message }
    </div>
  );
};
