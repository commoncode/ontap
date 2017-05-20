/**
 * Toggle button.
 * Calls `clickHandler(value)` on click.
 * When `value` === `activeValue` has class .active
 *
 * See keg-list.js for a demo.
 */

import React from 'react';
import reactPropTypes from 'prop-types';

export default class ToggleButton extends React.Component {

  static propTypes() {
    return {
      clickHandler: reactPropTypes.function,
      value: reactPropTypes.string,
      activeValue: reactPropTypes.string,
      title: reactPropTypes.title,
    };
  }

  constructor() {
    super();
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    this.props.clickHandler(this.props.value);
  }

  render() {
    const { title, value, activeValue } = this.props;

    return (
      <button
        onClick={this.clickHandler}
        className={value === activeValue ? 'active' : ''}
      >
        {title}
      </button>
    );
  }

}
