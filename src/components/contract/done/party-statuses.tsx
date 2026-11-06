import { contractEnded } from '@/components/contract/page/stopped-step';
import { cn } from '@/lib/utils';
import { isPending } from '@/queries/contract/options';
import type { ContractType } from '@/queries/contract/type';
import { PartyStatusRow } from './party-status-row';
import { UnderwriterRow } from './underwriter-row';

/**
 * Each party who signs the contract, and whether they signed, declined or are awaited. An
 * order that ended unpaid never reached signing: only who cancelled it shows, as cancelled,
 * and nothing when it expired. The underwriter follows, signed from the start, on any contract
 * that was made.
 */
export function PartyStatuses({
  contract,
  className,
}: {
  contract: ContractType;
  className?: string;
}) {
  const unpaidEnd = contractEnded(contract) && !contract.paid_on;
  const parties = contract.parties.filter(
    (p) => p.signs && (!unpaidEnd || p.declined_at),
  );
  if (parties.length === 0) {
    return null;
  }
  return (
    <ul
      className={cn(
        'w-full max-w-md divide-y rounded-xl border text-left text-sm',
        className,
      )}
    >
      {parties.map((p) => (
        <PartyStatusRow
          key={p.id}
          party={p}
          pending={isPending(contract.status)}
          cancelled={unpaidEnd}
        />
      ))}
      {!unpaidEnd && <UnderwriterRow underwriter={contract.underwriter} />}
    </ul>
  );
}
