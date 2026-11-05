import type { ContractNav } from '@/components/contract/page/contract-nav';
import { issuerContractsRoute } from './route';

/**
 * The issuer portal's contracts page as a stored contract's navigation. It keeps the tab and
 * page the list was on, so the way back from a contract returns there.
 */
export function useIssuerContractNav(): ContractNav {
  const { sign } = issuerContractsRoute.useSearch();
  const navigate = issuerContractsRoute.useNavigate();
  return {
    sign: !!sign,
    toList: () => navigate({ search: ({ tab, page }) => ({ tab, page }) }),
    toContract: (id) =>
      navigate({ search: ({ tab, page }) => ({ tab, page, contractId: id }) }),
    toSign: (id) =>
      navigate({
        search: ({ tab, page }) => ({ tab, page, contractId: id, sign: true }),
      }),
  };
}
