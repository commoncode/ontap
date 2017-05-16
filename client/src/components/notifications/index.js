/**
 * notifications component.
 * show notifications at the top of the app.
 *
 * note that this component can show multiple notifications
 * but the store only holds one at a time.
 */

import React from 'react';
import reactPropTypes from 'prop-types';
import { Container } from 'flux/utils';

import * as propTypes from '../../proptypes';
import notificationsStore from '../../stores/notifications';
import { removeNotification } from '../../actions/notifications';

// todo - don't use bind
// fix a11y issue by using a button
const NotificationsComponent = props => (
  <div className="notifications">
    { props.notifications.map((notification, i) => (
      <div
        key={i}
        className="notification"
        onClick={removeNotification.bind(null, i)} // eslint-disable-line react/jsx-no-bind
      >
        { notification.message }
      </div>
    )) }
  </div>
);

NotificationsComponent.propTypes = {
  notifications: reactPropTypes.arrayOf(propTypes.notificationModel),
};

class NotificationsContainer extends React.Component {
  static getStores() {
    return [notificationsStore];
  }

  static calculateState() {
    return {
      notifications: notificationsStore.getState().get('notifications').toArray(),
    };
  }

  render() {
    return (
      <NotificationsComponent
        notifications={this.state.notifications}
      />
    );
  }
}

export default Container.create(NotificationsContainer);
