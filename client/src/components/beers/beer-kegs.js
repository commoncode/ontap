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
        { Kegs.map((keg) => {
          const cheersCount = keg.Cheers.length;
          const uniqueCheersCount = new Set(keg.Cheers.map(k => k.userId)).size;
          return (
            <div className="list-item" key={keg.id}>
              <span className="keg-tapped">
                <a href={`/#/kegs/${keg.id}/`}>
                  {keg.tapped ?
                    `Tapped ${dayMonth(keg.tapped)}`
                    : 'Not yet tapped'
                  }

                  {keg.tapped && keg.untapped ?
                    ` - ${dayMonth(keg.untapped)} (${daysDiff(keg.tapped, keg.untapped)} days)`
                    : ''
                  }
                </a>
              </span>

              <span className="keg-cheers">
                <icon
                  className="icon emoji-beers"
                  style={{
                    height: '24px',
                    width: '24px',
                    marginRight: '12px',
                  }}
                />
                { cheersCount } Cheers from { uniqueCheersCount } user{ uniqueCheersCount !== 1 && 's'}
              </span>
            </div>
          );
        }) }
      </div>
    </div>
  );
};


BeerKegs.propTypes = {
  beer: beerModel,
  profile: profileModel,
};

export default BeerKegs;
