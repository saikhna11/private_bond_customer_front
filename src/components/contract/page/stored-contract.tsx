import { DoneStep } from '@/components/contract/done/done-step';
import { awaitingYou } from '@/queries/contract/options';
import { CoSignSteps } from './co-sign-steps';
import { ContractFailed } from './contract-failed';
import { ContractLoading } from './contract-loading';
import { ContractSection } from './contract-section';
import { contractsRoute } from './route';
import { usePdfPolling } from './use-pdf-polling';

/**
 * A stored contract. While it waits for the client's own signature, they read it with
 * the signatures given so far and sign it (CoSignSteps). Otherwise it shows whose
 * signatures it waits for, then its PDF rendering, then the signed PDF itself and its
 * download (DoneStep), polling while the PDF renders (usePdfPolling).
 */
export function StoredContract({ contractId }: { contractId: string }) {
  const navigate = contractsRoute.useNavigate();
  const { query, stopped, checkAgain } = usePdfPolling(contractId);
  const { data: contract, isPending, isFetching, error } = query;

  if (isPending) {
    return <ContractLoading />;
  }
  if (error) {
    return <ContractFailed error={error} />;
  }
  if (awaitingYou(contract)) {
    return <CoSignSteps contract={contract} />;
  }
  return (
    <ContractSection step="done" complete={contract.status === 'signed'}>
      <DoneStep
        contract={contract}
        stopped={stopped}
        checking={isFetching}
        onCheckAgain={checkAgain}
        onList={() => navigate({ search: {} })}
      />
    </ContractSection>
  );
}
