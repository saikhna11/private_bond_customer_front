import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { SalesStatus } from '@/queries/bond/type';

const styles: Record<SalesStatus, string> = {
  selling: 'bg-success/12 text-success',
  upcoming: 'bg-primary/10 text-primary',
  closed: 'bg-muted text-muted-foreground',
  paused: 'bg-warning/15 text-warning-foreground dark:text-warning',
  draft: 'bg-muted text-muted-foreground',
};

/** Whether a bond takes purchases today: selling, upcoming or closed. */
export function BondStatusBadge({
  status,
  className,
}: {
  status: SalesStatus;
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        styles[status],
        className,
      )}
    >
      {t(`bond.status.${status}`)}
    </span>
  );
}
