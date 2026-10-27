import type { ContractType } from '@/queries/contract/type';
import { PendingContract } from './pending-contract';
import { SignedContract } from './signed-contract';
import { useSignedToast } from './use-signed-toast';

/**
 * A stored contract as the client sees it once they signed or declined: the signed
 * contract itself (SignedContract), or whose signatures it still waits for and its PDF
 * rendering (PendingContract). stopped says the page gave up polling for the PDF;
 * onCheckAgain checks once and polls again.
 */
export function DoneStep({
  contract,
  stopped,
  checking,
  onCheckAgain,
  onList,
}: {
  contract: ContractType;
  stopped: boolean;
  checking: boolean;
  onCheckAgain: () => void;
  onList: () => void;
}) {
  useSignedToast(contract);

  if (contract.status === 'signed') {
    return <SignedContract contract={contract} onList={onList} />;
  }
  return (
    <PendingContract
      contract={contract}
      slow={contract.status === 'rendering' && stopped}
      checking={checking}
      onCheckAgain={onCheckAgain}
      onList={onList}
    />
  );
}
