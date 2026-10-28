import { CircleCheckIcon, CircleXIcon, ClockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { partyLabel, partyName } from '@/components/contract/format';
import { cn } from '@/lib/utils';
import type { PartyType } from '@/queries/contract/type';

/**
 * One party who signs, and whether they signed or declined. pending says the contract
 * still waits for signatures: one not given yet is awaited rather than missing.
 */
export function PartyStatusRow({
  party: p,
  pending,
}: {
  party: PartyType;
  pending: boolean;
}) {
  const { t } = useTranslation();
  const state = p.signed_at
    ? {
        label: t('contract.partyState.signed'),
        className: 'text-success',
        Icon: CircleCheckIcon,
      }
    : p.declined_at
      ? {
          label: t('contract.partyState.declined'),
          className: 'text-destructive',
          Icon: CircleXIcon,
        }
      : {
          label: t(
            pending
              ? 'contract.partyState.awaited'
              : 'contract.partyState.unsigned',
          ),
          className: 'text-warning-foreground dark:text-warning',
          Icon: ClockIcon,
        };

  return (
    <li className="flex items-center justify-between gap-3 px-3 py-2">
      <span className="min-w-0">
        <span className="block text-xs text-muted-foreground">
          {partyLabel(p.type)}
        </span>
        <span className="block truncate font-medium">{partyName(p)}</span>
      </span>
      <span
        className={cn(
          'flex shrink-0 items-center gap-1 text-xs font-medium',
          state.className,
        )}
      >
        <state.Icon className="size-3.5" />
        {state.label}
      </span>
    </li>
  );
}
