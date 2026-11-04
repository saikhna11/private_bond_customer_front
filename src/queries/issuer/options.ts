import { queryOptions } from '@tanstack/react-query';
import { getIssuerMe } from './query';

export const issuerKeys = {
  all: ['issuer'] as const,
  me: () => [...issuerKeys.all, 'me'] as const,
};

export function issuerMeOptions() {
  return queryOptions({
    queryKey: issuerKeys.me(),
    queryFn: getIssuerMe,
    staleTime: 1000 * 60 * 5,
  });
}
