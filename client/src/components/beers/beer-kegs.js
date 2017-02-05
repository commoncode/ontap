/**
 * BeerKegs.
 *
 * List the Kegs that we've got for a given Beer.
 */

import React from 'react';

import { dayMonth, daysDiff } from '../../util/date';
import { beerModel, profileModel } from '../../proptypes';

const BeerKegs = (props) => {
  const { Kegs } = props.beer;
  const isAdmin = !!props.profile.admin;

  if (!Kegs.length) {
    return (
      <div className="beer-kegs-list">
        <h3 className="title">Kegs of {props.beer.name}</h3>
        <p className="no-kegs">
          {'We\'ve never had a keg of this. '}
          {isAdmin && <a href="/#/kegs/new/">
            Add one?
          </a>}
        </p>

      </div>
    );
  }

  return (
    <div className="beer-kegs-list">
      <h3 className="title">Kegs of {props.beer.name}</h3>

      <div className="list">
        { Kegs.map(keg => (
          <div className="list-item">
            <span className="keg-title">
              Keg {keg.id}
            </span>

            <span className="keg-tapped">
              {keg.tapped ?
                `${dayMonth(keg.tapped)}`
                : 'Not yet tapped'
              }

              {keg.tapped && keg.untapped ?
                ` - ${dayMonth(keg.untapped)} (${daysDiff(keg.tapped, keg.untapped)} days)`
                : ''
              }
            </span>

            {isAdmin && <div className="keg-actions">
              <a href={`/#/kegs/${keg.id}/`}>Edit</a>
            </div>}

          </div>
        )) }
      </div>
    </div>
  );
};


BeerKegs.propTypes = {
  beer: beerModel,
  profile: profileModel,
};

export default BeerKegs;
