import React from 'react';
import autobind from 'autobind-decorator';

import EditForm from '../generic/edit-form';

import { updateUser, deleteUser } from '../../actions/users';


@autobind
class UserEdit extends EditForm {

  constructor(props) {
    super(props);

    this.state.showDelete = false;
  }

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

  toggleDelete() {
    this.setState({
      showDelete: !this.state.showDelete,
    });
  }

  deleteUser() {
    // delete the user, redirect appropriately
    deleteUser(this.props.model.id)
    .then(() => {
      if (this.props.isCurrentUser) {
        document.location = '/logout';
      } else {
        document.location.hash = '/users/';
      }
    });
  }

  render() {
    const { state } = this;
    const { isAdmin, isCurrentUser } = this.props;
    const { showDelete } = this.state;

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

        <div className="edit-form__delete">
          <a className="btn-delete" onClick={this.toggleDelete}>
            Delete { isCurrentUser ? 'my account' : 'this user' }
          </a>
          { showDelete && (
            <a className="btn-delete-confirm" onClick={this.deleteUser}>I am serious, do it.</a>
          ) }
        </div>


      </div>
    );
  }
}


export default UserEdit;
