import React from 'react';
import autobind from 'autobind-decorator';

import EditForm from '../generic/edit-form';

@autobind
class UserEdit extends EditForm {

  constructor(props) {
    super(props);

    this.state.showDelete = false;
  }

  save(evt) {
    evt.preventDefault();
    this.props.save(this.state.model);
  }

  delete(evt) {
    evt.preventDefault();
    this.props.delete(this.props.model.id);
  }

  toggleDelete() {
    this.setState({
      showDelete: !this.state.showDelete,
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
            <a className="btn-delete-confirm" onClick={this.delete}>I am serious, do it.</a>
          ) }
        </div>


      </div>
    );
  }
}


export default UserEdit;
