/**
 * KegSummaryCheers
 *
 * The Cheers summary for a Keg.
 * Pass it a Keg.
 */

import React from 'react';
import reactPropTypes from 'prop-types';
import autobind from 'autobind-decorator';

import { cheersKeg } from '../../actions/kegs';
import { addNotification } from '../../actions/notifications';
import * as propTypes from '../../proptypes';

import CheersAnimation from '../../images/cheers-optimised.gif';

@autobind
class KegSummaryCheers extends React.Component {

  static propTypes = {
    Cheers: reactPropTypes.arrayOf(reactPropTypes.shape(propTypes.cheersModel)),
    Beer: reactPropTypes.shape(propTypes.beerModel),
    profile: reactPropTypes.shape(propTypes.userModel),
  }

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      cheersing: false,
    };
  }

  toggleModal() {
    const { profile } = this.props;

    if (!profile.id) {
      return addNotification('Login first to Cheers a beer.');
    }

    return this.setState({
      showModal: !this.state.showModal,
    });
  }

  cheersKeg() {
    if (this.state.cheersing) return false;

    this.setState({
      cheersing: true,
    });

    return cheersKeg(this.props.id)
    .then(() => this.setState({
      cheersing: false,
      showModal: false,
    }));
  }


  render() {
    const { Cheers, Beer } = this.props;
    const { showModal, cheersing } = this.state;

    const imageStyle = {
      opacity: cheersing ? 0.4 : 1,
    };

    return (
      <div
        className="keg-summary__cheers"
        onClick={this.toggleModal}
      >
        <icon className="icon emoji-beers" />
        <p className="count">{Cheers.length}</p>

        {showModal && (
          <div className="cheers-modal">
            <div
              className="cheers-modal__contents"
              onClick={evt => evt.stopPropagation()}
            >
              <p
                className="cheers-modal__contents__title"
              >Tap below to cheers the <br /><b>{Beer.name}</b></p>
              <img
                onClick={this.cheersKeg}
                alt="Cheers"
                src={CheersAnimation}
                className="cheers-modal__contents__button"
                style={imageStyle}
              />
            </div>
          </div>
        )}

      </div>

    );
  }

}

export default KegSummaryCheers;
