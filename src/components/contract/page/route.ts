import { getRouteApi } from '@tanstack/react-router';

/**
 * The contracts page's search and navigation, for its parts outside the route file: they
 * read it from here rather than import the route, which imports them.
 */
export const contractsRoute = getRouteApi('/_customer/contracts/');
