import {
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  FilePenLineIcon,
  LoaderCircleIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { ContractSummaryType } from '@/queries/contract/type';

const statuses: Record<
  ContractSummaryType['status'],
  { className: string; Icon: typeof CircleCheckIcon }
> = {
  draft: {
    className: 'bg-muted text-muted-foreground',
    Icon: FilePenLineIcon,
  },
  // Stored with the first signature, it waits for the other parties' own.
  pending_signature: {
    className: 'bg-warning/15 text-warning-foreground dark:text-warning',
    Icon: ClockIcon,
  },
  // Every party has signed: its PDF is rendering.
  rendering: {
    className: 'bg-warning/15 text-warning-foreground dark:text-warning',
    Icon: LoaderCircleIcon,
  },
  signed: {
    className: 'bg-success/12 text-success',
    Icon: CircleCheckIcon,
  },
  cancelled: {
    className: 'bg-destructive/10 text-destructive',
    Icon: CircleXIcon,
  },
};

/** A contract's status, styled as the client's review status is (StatusBadge). */
export function ContractStatusBadge({
  status,
  className,
}: {
  status: ContractSummaryType['status'];
  className?: string;
}) {
  const { t } = useTranslation();
  const s = statuses[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        s.className,
        className,
      )}
    >
      <s.Icon
        className={cn(
          'size-3.5',
          status === 'rendering' && 'animate-spin motion-reduce:animate-none',
        )}
      />
      {t(`contract.status.${status}`)}
    </span>
  );
}
