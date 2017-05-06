/**
 * EditForm
 * Extendable class that provides some help for editing forms.
 */

import React from 'react';
import autobind from 'autobind-decorator';


@autobind
class EditForm extends React.Component {

  static propTypes = {
    model: React.PropTypes.object, // eslint-disable-line react/forbid-prop-types
  }

  constructor(props) {
    super(props);

    this.state = {
      model: Object.assign({}, props.model),
    };
  }

  // handle change to an input, textarea
  inputChangeHandler(evt) {
    this.setState({
      model: Object.assign(this.state.model, {
        [evt.target.name]: evt.target.value,
      }),
    });
  }

  // handle checkbox change
  checkboxChangeHandler(evt) {
    this.setState({
      model: Object.assign(this.state.model, {
        [evt.target.name]: evt.target.checked,
      }),
    });
  }

  // debugging
  logState() {
    console.log(this.state); // eslint-disable-line no-console
  }
}

export default EditForm;