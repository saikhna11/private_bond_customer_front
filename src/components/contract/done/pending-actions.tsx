import { ArrowLeftIcon, RefreshCwIcon } from 'lucide-react';
import { DeclineButton } from '@/components/contract/decline-button';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { yourParty } from '@/queries/contract/options';
import type { ContractType } from '@/queries/contract/type';

/**
 * What the client can do with a pending contract: go back to the list, decline it while
 * it waits for signatures, or check again once polling for its PDF stopped (slow).
 */
export function PendingActions({
  contract,
  slow,
  checking,
  onCheckAgain,
  onList,
}: {
  contract: ContractType;
  slow: boolean;
  checking: boolean;
  onCheckAgain: () => void;
  onList: () => void;
}) {
  const you = yourParty(contract);

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button variant="outline" className="h-10 rounded-xl" onClick={onList}>
        <ArrowLeftIcon />
        Гэрээнүүд
      </Button>
      {contract.status === 'pending_signature' && you?.signs && (
        <DeclineButton contractId={contract.id} signed={!!you.signed_at} />
      )}
      {slow && (
        <Button
          className="h-10 rounded-xl px-6"
          onClick={onCheckAgain}
          disabled={checking}
        >
          <RefreshCwIcon
            className={cn(
              checking && 'animate-spin motion-reduce:animate-none',
            )}
          />
          Дахин шалгах
        </Button>
      )}
    </div>
  );
}
