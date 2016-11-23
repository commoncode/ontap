import React from 'react';

const valueMap = new Map();
valueMap.set(1, 'happy');
valueMap.set(-1, 'sad');
valueMap.set(0, 'meh');

export default props => (
  <div className={`emoji emoji-${valueMap.get(props.value)}`} />
);
