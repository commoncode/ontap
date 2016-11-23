/**
 * Toggle button.
 * Calls `clickHandler(value)` on click.
 * When `value` === `activeValue` has class .active
 *
 * See keg-list.js for a demo.
 */

import React from 'react';

export default class ToggleButton extends React.Component {

  static propTypes() {
    return {
      clickHandler: React.PropTypes.function,
      value: React.PropTypes.string,
      activeValue: React.PropTypes.string,
      title: React.PropTypes.title,
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
