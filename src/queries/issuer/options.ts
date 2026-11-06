import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { issuerContractApi } from '@/queries/contract/api';
import { storedKeys } from '@/queries/contract/options';
import {
  getIssuerContracts,
  getIssuerMe,
  type IssuerContractFilter,
} from './query';
import type { IssuerContractView } from './type';

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

/**
 * A page of the issuer's contracts in tab. Its key sits under the issuer contracts' list
 * key, so a signature or a decline refreshes every tab; the previous page stays on screen
 * while the next loads.
 */
export function issuerContractsOptions(
  tab: IssuerContractView,
  page: number,
  f: IssuerContractFilter = {},
) {
  return queryOptions({
    queryKey: [...storedKeys(issuerContractApi).list(), tab, page, f] as const,
    queryFn: () => getIssuerContracts(tab, page, f),
    placeholderData: keepPreviousData,
  });
}
