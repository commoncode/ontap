/**
 * Error component.
 * Display an error. Mostly for use with fetch.
 */

import React from 'react';
import propTypes from 'prop-types';

const Error = (props) => {
  if (!props) return null;

  return (
    <div className="error">
      { props.message }
    </div>
  );
};

Error.propTypes = {
  message: propTypes.string,
};

export default Error;
