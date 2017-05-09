import React from 'react';
import autobind from 'autobind-decorator';

import EditForm from '../generic/edit-form';

import { updateUser } from '../../actions/users';


@autobind
class UserEdit extends EditForm {

  save(evt) {
    evt.preventDefault();
    const { id } = this.props.model;
    const { name, email, admin } = this.state.model;

    updateUser(id, {
      name,
      email,
      admin,
    })
    .then(this.props.reset);
  }

  render() {
    const { state } = this;
    const { isAdmin } = this.props;

    return (
      <div className="user-edit edit-form">

        <form onSubmit={this.save}>

          <label htmlFor="name">Name</label>
          <input
            name="name"
            value={state.model.name}
            onChange={this.inputChangeHandler}
          />

          <label htmlFor="email">Email</label>
          <input
            name="email"
            value={state.model.email}
            onChange={this.inputChangeHandler}
          />

          {isAdmin && (
            <fieldset>
              <label htmlFor="admin">Admin</label>
              <input
                type="checkbox"
                name="admin"
                checked={state.model.admin}
                onChange={this.checkboxChangeHandler}
              />
            </fieldset>
          )}

          <button type="submit" >Save</button>
          <button onClick={this.props.reset}>Cancel</button>

        </form>
      </div>
    );
  }
}


export default UserEdit;
