// DIY router.
// seemed like a good idea but it's probably a bit crap.
// just didn't want to use React Router because I hate it,
// but I can't even remember why now.

// todo - configure app & dev servers so we can use pushstate
// and not just crappy hash routes

import React from 'react';

import KegList from './kegs/keg-list';
import Taps from './taps';
import KegDetail from './kegs/keg-detail';


// define your routes.
// use ? to grab a param
// they're not named, they're just passed to your
// props function in order.
const routes = {
  '/example/?/?': {
    component: KegList,
    props: (props, params) => ({
      foo: 'bar',
      bar: props.bar,
      firstParam: params[0],
      secondParam: params[1],
    }),
  },
  '/kegs/?': {
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
  '/taps': {
    component: Taps,
    props: props => ({
      profile: props.profile.data,
    }),
  },
};

// set a default route
routes.defaultRoute = routes['/taps'];


// converts ? literals to capture groups for capturing params
function routeToRegex(route) {
  return new RegExp(route.replace(/\?/g, '([\\w|\\-]+)'));
}


class ContentRouter extends React.Component {

  static getRoute() {
    for (const path of Object.keys(routes)) {
      const match = document.location.hash.match(routeToRegex(path));
      if (match) {
        return Object.assign({}, routes[path], {
          params: match.slice(1),
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
    const props = route.props(this.props, route.params);

    return (
      <Component {...props} />
    );
  }

}

export default ContentRouter;
