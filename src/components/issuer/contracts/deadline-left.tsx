import { useTranslation } from 'react-i18next';
import { formatDateTime } from '@/components/contract/format';
import { cn } from '@/lib/utils';
import { hoursLeft } from './deadline';

/**
 * A contract's signing deadline and the hours left until it, warning in its last day and
 * once it passed.
 */
export function DeadlineLeft({ deadline }: { deadline?: string }) {
  const { t } = useTranslation();
  if (!deadline) {
    return null;
  }
  const hours = hoursLeft(deadline);
  return (
    <span className="block whitespace-nowrap">
      <span className="tabular block">{formatDateTime(deadline)}</span>
      <span
        className={cn(
          'block text-xs',
          hours <= 0
            ? 'text-destructive'
            : hours < 24
              ? 'text-warning-foreground dark:text-warning'
              : 'text-muted-foreground',
        )}
      >
        {hours <= 0
          ? t('issuer.contracts.overdue')
          : t('issuer.contracts.hoursLeft', { count: hours })}
      </span>
    </span>
  );
}
