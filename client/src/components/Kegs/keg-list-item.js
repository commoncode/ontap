/**
 * Keg List Item.
 * Wraps a Keg component so it can be edited inline.
 */

import React from 'react';

import { toggleEditKeg } from '../../actions/kegs';

import Keg from './keg';
import KegEdit from './kegedit';
import Loader from '../Loader';

class KegListItem extends React.Component {
  static propTypes() {
    return {
      editing: React.PropTypes.boolean.required,
      syncing: React.PropTypes.boolean.required,
      model: React.PropTypes.object.required,
      profile: React.PropTypes.object,
    };
  }

  render() {
    const { editing, syncing, model, profile } = this.props;

    return (
      <div className="keg-list-item">
        { editing && <KegEdit model={model} syncing={syncing} /> }
        { syncing && <Loader /> }
        { !editing && <Keg {...model} /> }

        { profile && profile.admin &&
          <a onClick={() => toggleEditKeg(model.id)}>[edit]</a>
        }
      </div>
    );
  }
}

export default KegListItem;
