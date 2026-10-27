import { cn } from '@/lib/utils';
import type { ContractType } from '@/queries/contract/type';
import { PartyStatusRow } from './party-status-row';

/** Each party who signs the contract, and whether they signed, declined or are awaited. */
export function PartyStatuses({
  contract,
  className,
}: {
  contract: ContractType;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        'w-full max-w-md divide-y rounded-xl border text-left text-sm',
        className,
      )}
    >
      {contract.parties
        .filter((p) => p.signs)
        .map((p) => (
          <PartyStatusRow
            key={p.id}
            party={p}
            pending={contract.status === 'pending_signature'}
          />
        ))}
    </ul>
  );
}
