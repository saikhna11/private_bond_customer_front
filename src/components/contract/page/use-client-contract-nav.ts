import type { ContractNav } from './contract-nav';
import { contractsRoute } from './route';

/** The client's contracts page as a stored contract's navigation (ContractNav). */
export function useClientContractNav(): ContractNav {
  const { sign } = contractsRoute.useSearch();
  const navigate = contractsRoute.useNavigate();
  return {
    sign: !!sign,
    toList: () => navigate({ search: {} }),
    toContract: (id) => navigate({ search: { contractId: id } }),
    toSign: (id) => navigate({ search: { contractId: id, sign: true } }),
  };
}
