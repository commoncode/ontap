/**
 * Keg List Item.
 * Wraps a Keg component so it can be edited inline.
 */

import React from 'react';

import { toggleEditKeg } from '../../actions/kegs';
import * as propTypes from '../../proptypes/';

import Keg from './keg';
import KegEdit from './keg-edit';
import Loader from '../Loader/';

const KegListItem = (props) => {
  const { editing, syncing, model, profile } = props;

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
};

KegListItem.propTypes = {
  editing: React.PropTypes.boolean.required,
  syncing: React.PropTypes.boolean.required,
  model: propTypes.kegModel,
  profile: propTypes.profile,
};


export default KegListItem;
