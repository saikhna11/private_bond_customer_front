import { ContractFailed } from '@/components/contract/page/contract-failed';
import { ContractLoading } from '@/components/contract/page/contract-loading';
import type { ContractNav } from '@/components/contract/page/contract-nav';
import { usePdfPolling } from '@/components/contract/page/use-pdf-polling';
import { ContractTerms } from '@/components/contract/preview/contract-terms';
import { IssuerClientInfo } from './issuer-client-info';
import { IssuerContractDocument } from './issuer-contract-document';
import { IssuerContractHeader } from './issuer-contract-header';
import { IssuerContractParties } from './issuer-contract-parties';
import { IssuerContractState } from './issuer-contract-state';
import { IssuerSignStep } from './issuer-sign-step';

/**
 * One of the issuer's contracts: where it stands and what the director can do, its terms,
 * its client, its three parties and its document, polling while its PDF renders
 * (usePdfPolling). The director signs it on its own step (nav.sign) while it awaits them.
 */
export function IssuerContractDetail({
  contractId,
  nav,
}: {
  contractId: string;
  nav: ContractNav;
}) {
  const { query, stopped, checkAgain } = usePdfPolling(contractId);
  const { data: contract, isPending, isFetching, error } = query;

  if (isPending) {
    return <ContractLoading />;
  }
  if (error) {
    return <ContractFailed error={error} onBack={nav.toList} />;
  }
  if (nav.sign && contract.your_party_id) {
    return <IssuerSignStep contract={contract} nav={nav} />;
  }
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <IssuerContractHeader contract={contract} onBack={nav.toList} />
      <IssuerContractState
        contract={contract}
        slow={contract.status === 'rendering' && stopped}
        checking={isFetching}
        onCheckAgain={checkAgain}
        onSign={() => nav.toSign(contract.id)}
      />
      <ContractTerms terms={contract} />
      <div className="grid gap-6 lg:grid-cols-2">
        <IssuerClientInfo contract={contract} />
        <IssuerContractParties contract={contract} />
      </div>
      <IssuerContractDocument contract={contract} />
    </div>
  );
}
