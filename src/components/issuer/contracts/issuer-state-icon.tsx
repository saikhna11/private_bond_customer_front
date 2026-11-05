import {
  CircleCheckIcon,
  CircleXIcon,
  ClockAlertIcon,
  ClockIcon,
  LoaderCircleIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContractType } from '@/queries/contract/type';

/**
 * The round icon heading where one of the issuer's contracts stands: awaiting the director,
 * its PDF rendering (a clock once slow), signed, failed, declined or expired.
 */
export function IssuerStateIcon({
  status,
  slow,
}: {
  status: ContractType['status'];
  slow: boolean;
}) {
  const { Icon, className } =
    status === 'signed'
      ? { Icon: CircleCheckIcon, className: 'bg-success/12 text-success' }
      : status === 'cancelled'
        ? { Icon: CircleXIcon, className: 'bg-destructive/10 text-destructive' }
        : status === 'expired'
          ? {
              Icon: ClockAlertIcon,
              className: 'bg-muted text-muted-foreground',
            }
          : status === 'failed'
            ? {
                Icon: TriangleAlertIcon,
                className: 'bg-destructive/10 text-destructive',
              }
            : {
                Icon:
                  status === 'rendering' && !slow
                    ? LoaderCircleIcon
                    : ClockIcon,
                className:
                  'bg-warning/15 text-warning-foreground dark:text-warning',
              };

  return (
    <span
      className={cn(
        'flex size-12 shrink-0 items-center justify-center rounded-full',
        className,
      )}
    >
      <Icon
        className={cn(
          'size-6',
          Icon === LoaderCircleIcon &&
            'animate-spin motion-reduce:animate-none',
        )}
      />
    </span>
  );
}
