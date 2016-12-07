// DIY router.
// seemed like a good idea but it's probably a bit crap.
// just didn't want to use React Router because I hate it,
// but I can't even remember why now.

// todo - configure app & dev servers so we can use pushstate
// and not just crappy hash routes

import React from 'react';

import KegDetail from './kegs/keg-detail';
import KegEdit from './kegs/keg-edit';
import KegList from './kegs/keg-list';
import Taps from './taps';
import TapChange from './taps/tap-change';
import UserDetail from './users/user-detail';
import BeerList from './beers/beer-list';
import BeerDetail from './beers/beer-detail';


// define your routes.
// use ! to grab a param
// they're not named, they're just passed to your
// props function in order.
//
// don't forget to add a key prop to any routes with params.
// without that, if you change params but not routes
// it won't refresh.
const routes = {
  '/example/!/!': {
    component: KegList,
    props: (props, params) => ({
      foo: 'bar',
      bar: props.bar,
      firstParam: params[0],
      secondParam: params[1],
    }),
  },
  '/kegs/new': {
    component: KegEdit,
    props: props => ({
      profile: props.profile.data,
    }),
  },
  '/kegs/!': {
    component: KegDetail,
    props: (props, params) => ({
      kegId: Number(params[0]),
      key: params[0],
    }),
  },
  '/kegs': {
    component: KegList,
    props: props => ({
      profile: props.profile.data,
    }),
  },
  '/taps/!': {
    component: TapChange,
    props: (props, params) => ({
      profile: props.profile.data,
      tapId: Number(params[0]),
      key: params[0],
    }),
  },
  '/taps': {
    component: Taps,
    props: props => ({
      profile: props.profile.data,
    }),
  },
  '/users/!': {
    component: UserDetail,
    props: (props, params) => ({
      profile: props.profile.data,
      userId: Number(params[0]),
      key: params[0],
    }),
  },
  '/beers/!': {
    component: BeerDetail,
    props: (props, params) => ({
      beerId: Number(params[0]),
      key: params[0],
    }),
  },
  '/beers': {
    component: BeerList,
    props: (props, params, queryParams) => ({
      profile: props.profile.data,
      queryParams,
    }),
  },
};

// set a default route
routes.defaultRoute = routes['/kegs'];


// converts ! literals to capture groups for capturing params
function routeToRegex(route) {
  return new RegExp(route.replace(/!/g, '([\\w|\\-]+)'));
}

// foo=bar&bar=qux => object
export function queryParamsToObject(str) {
  const pairs = str.split('&');

  return pairs.reduce((acc, pair) => {
    const split = pair.split('=');
    acc[split[0]] = split[1]; // eslint-disable-line no-param-reassign
    return acc;
  }, {});
}

// object => foo=bar&bar=qux
export function objectToQueryParams(obj) {
  const pairs = Object.keys(obj).map(key => `${key}=${obj[key]}`);
  return pairs.join('&');
}

// return the query params as an object
// pass in a path as a string, we can't use location.search
// because we're using hash urls.
function getQueryParams(pathWithParams) {
  const match = pathWithParams.match(/\?.*/);
  if (!match) return {};

  return queryParamsToObject(match[0].slice(1));
}


export function replaceQueryParams(params) {
  const path = document.location.hash;
  const currentQueryParams = getQueryParams(document.location.hash);

  const newQueryParams = {
    ...currentQueryParams,
    ...params,
  };

  const stringifiedQueryParams = objectToQueryParams(newQueryParams);

  debugger;

  history.replaceState({}, null, path.replace(/\?.*/, `?${stringifiedQueryParams}`));
}


class ContentRouter extends React.Component {

  static getRoute() {
    for (const path of Object.keys(routes)) {
      const match = document.location.hash.match(routeToRegex(path));
      if (match) {
        const queryParams = getQueryParams(document.location.hash);
        return Object.assign({}, routes[path], {
          params: match.slice(1),
          queryParams,
        });
      }
    }
    return routes.defaultRoute;
  }

  constructor() {
    super();
    this.state = {
      route: ContentRouter.getRoute(),
    };

    this.onHistoryChange = this.onHistoryChange.bind(this);

    window.addEventListener('hashchange', this.onHistoryChange);
  }

  onHistoryChange() {
    this.setState({
      route: ContentRouter.getRoute(),
    });
  }

  render() {
    const { route } = this.state;
    const Component = route.component;
    const props = route.props(this.props, route.params, route.queryParams);

    return (
      <Component {...props} />
    );
  }

}

export default ContentRouter;
