import _ from 'lodash';
import { Route } from '../routers/router';

export const routeToString = (route: Route): string => {
  const routeStr = [];
  const tokenPath = _.map(route.tokenPath, (token) => `${token.symbol}`);
  const poolFeePath = _.map(
    route.pools,
    (pool) => ` -- ${pool.fee / 10000}% --> `
  );

  for (let i = 0; i < tokenPath.length; i++) {
    routeStr.push(tokenPath[i]);
    if (i < poolFeePath.length) {
      routeStr.push(poolFeePath[i]);
    }
  }

  return routeStr.join('');
};
