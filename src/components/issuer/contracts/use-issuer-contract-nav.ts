import type { ContractNav } from '@/components/contract/page/contract-nav';
import { issuerContractsRoute } from './route';

/** The issuer portal's contracts page as a stored contract's navigation. */
export function useIssuerContractNav(): ContractNav {
  const { sign } = issuerContractsRoute.useSearch();
  const navigate = issuerContractsRoute.useNavigate();
  return {
    sign: !!sign,
    toList: () => navigate({ search: {} }),
    toContract: (id) => navigate({ search: { contractId: id } }),
    toSign: (id) => navigate({ search: { contractId: id, sign: true } }),
  };
}
