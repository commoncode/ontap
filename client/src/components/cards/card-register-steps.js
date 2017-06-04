import React from 'react';
import reactPropTypes from 'prop-types';

import { stepTo, fetchCard, registerCard, retry } from '../../actions/card-register';
import { userModel, cardModel, cheersModel } from '../../proptypes';

import { UserCheersItem } from '../users/user-cheers';


function register(uid) {
  stepTo(3);
  registerCard(uid);
}

// explain how it works
const Intro = () => (
  <div className="instructions">
    <p>
      Cheers a beer by tapping an NFC token on the reader at the bar.
    </p>
    <p className="important">
      You can Cheers now and register your token later - your Cheers will be added to your profile.
    </p>

    <button onClick={() => stepTo(1)} className="btn alt">Register an NFC token</button>
  </div>
);

// make sure the user's logged in
const Whoami = props => (
  <div className="whoami">
    {props.profile.id && (
      <div className="logged-in">
        <p>
          You're logged in as <b>{props.profile.name}</b>.
        </p>
        <button className="btn alt" onClick={() => stepTo(2)}>Continue</button>
        <a className="btn" href="/logout">Logout</a>
      </div>
    )}

    {!props.profile.id && (
      <div className="logged-out">
        <p>To begin, please login or create an OnTap account.</p>
        <a className="btn" href="/login">Login with Google</a>
      </div>
    )}
  </div>
);

Whoami.propTypes = {
  profile: reactPropTypes.shape(userModel),
};

// check the card, display any errors
const CheckCard = (props) => {
  const { cardUid, badCard, error } = props;

  return (
    <div className="check-card">
      {!cardUid && (
        <div className="check-uid">
          <p>Please place and hold your NFC token on the reader.</p>
          <p className="important">While holding your token on the reader, tap below.</p>
          <button className="btn alt" onClick={fetchCard}>Check my token</button>
        </div>
      )}

      {badCard && (
        <div className="error">
          <p>
            Unable to detect an NFC token. Is the reader light green?
          </p>
          <p>
            Not all tokens are compatible. Ask your Beer Baron if you're not sure.
          </p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{ error }</p>
        </div>
      )}
    </div>
  );
};

CheckCard.propTypes = {
  cardUid: reactPropTypes.string,
  error: reactPropTypes.string,
  badCard: reactPropTypes.bool,
};

// got card from tapontap; attempt to register, display any errors
const ConfirmRegistration = props => (
  <div className="confirm-registration">

    {!props.duplicateCard && !props.registeredCard && (
      <div>
        <p>Great, we've detected a compatible NFC token on the reader.</p>
        <p className="important">Tap below to link this token to your OnTap account.</p>
        <button
          className="btn alt"
          onClick={() => registerCard(props.cardUid)}
        >Register this token</button>
      </div>
    )}

    {props.duplicateCard && (
      <div className="duplicate-card">
        <div className="error">
          <p>That token is already registered.</p>
        </div>
        <p className="important">Please try another NFC token.</p>
        <button className="btn" onClick={retry}>Start again</button>
      </div>
    )}

    {props.registeredCard && (
      <div className="registration-confirmed">
        <p>Success! Your NFC token has been linked to your account.</p>
        <p className="">Manage your tokens in <b><a href="/#/profile">My Profile</a></b>.</p>

        {props.registeredCard.cheers.length ? (
          <div className="found-cheers">
            <h3>You've got {props.registeredCard.cheers.length} new Cheers:</h3>
            <div className="cheers-list single-line-list">
              {props.registeredCard.cheers.map(cheers =>
                <UserCheersItem {...cheers} key={cheers.id} />
              )}
            </div>

          </div>
        ) : (
          <div className="no-cheers">
            <h3>How to use your token</h3>
            <p>Tap once on the reader to Cheers the beer on tap. You'll hear a beep and see a green light.</p>
            <p>Cheers a beer as many times as you like. Whenever it hits the spot!</p>
            <p className="important">Cheers! <icon className="icon emoji-beers" /></p>
          </div>
        )}

      </div>
    )}

    {props.error && (
      <div className="error">
        <p>{props.error}</p>
      </div>
    )}


  </div>
);

ConfirmRegistration.propTypes = {
  cardUid: reactPropTypes.string,
  error: reactPropTypes.string,
  duplicateCard: reactPropTypes.bool,
  registeredCard: reactPropTypes.shape({
    // card: reactPropTypes.shape(cardModel),
    cheers: reactPropTypes.arrayOf(reactPropTypes.shape(cheersModel)),
  }),
};

const stepsInOrder = [Intro, Whoami, CheckCard, ConfirmRegistration];

const CurrentStep = (props) => {
  const StepComponent = stepsInOrder[props.step];
  return <StepComponent {...props} />;
};

CurrentStep.propTypes = {
  step: reactPropTypes.number,
};

export default CurrentStep;
