import { CircleCheckIcon, CircleXIcon, ClockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { ReviewStatus } from '@/queries/auth/type';

const statuses: Record<
  ReviewStatus,
  { className: string; Icon: typeof ClockIcon }
> = {
  pending: {
    className: 'bg-warning/15 text-warning-foreground dark:text-warning',
    Icon: ClockIcon,
  },
  approved: {
    className: 'bg-success/12 text-success',
    Icon: CircleCheckIcon,
  },
  rejected: {
    className: 'bg-destructive/10 text-destructive',
    Icon: CircleXIcon,
  },
};

export function StatusBadge({
  status,
  className,
}: {
  status: ReviewStatus;
  className?: string;
}) {
  const { t } = useTranslation();
  const s = statuses[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        s.className,
        className,
      )}
    >
      <s.Icon className="size-3.5" />
      {t(`status.${status}`)}
    </span>
  );
}
