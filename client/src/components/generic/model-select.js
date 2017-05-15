/**
 * ModelSelect
 * Display a list of models as a Select element.
 */

import React from 'react';
import propTypes from 'prop-types';

const ModelSelect = (props) => {
  const { models, value, error, onChange } = props;

  return (
    <div className="model-select">
      <select onChange={evt => onChange(evt.target.value)} value={value}>
        <option value={-1} disabled>Select...</option>
        { models.map(model => (
          <option
            key={model.id}
            value={model.id}
          >{model.name}</option>
        )) }
      </select>
      { error && (
        <p className="model-select__error">Error fetching: { error.message }</p>
      ) }
    </div>
  );
};

ModelSelect.propTypes = {
  models: propTypes.arrayOf(propTypes.shape({
    name: propTypes.string,
    id: propTypes.number,
  })),
  value: propTypes.number,
  error: propTypes.object, // eslint-disable-line react/forbid-prop-types
  onChange: propTypes.func,
};


export default ModelSelect;
