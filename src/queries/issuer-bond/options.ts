import { queryOptions } from '@tanstack/react-query';
import { getIssuerBond, getIssuerBonds } from './query';

export const issuerBondKeys = {
  all: ['issuer-bonds'] as const,
  list: () => [...issuerBondKeys.all, 'list'] as const,
  detail: (id: string) => [...issuerBondKeys.all, 'detail', id] as const,
};

export function issuerBondsOptions() {
  return queryOptions({
    queryKey: issuerBondKeys.list(),
    queryFn: getIssuerBonds,
  });
}

export function issuerBondOptions(id: string) {
  return queryOptions({
    queryKey: issuerBondKeys.detail(id),
    queryFn: () => getIssuerBond(id),
  });
}
