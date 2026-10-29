import {
  CircleXIcon,
  ClockIcon,
  LoaderCircleIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContractType } from '@/queries/contract/type';

/**
 * The round icon heading a contract not signed yet: cancelled or expired, its PDF failed,
 * waiting, or its PDF rendering.
 */
export function PendingStatusIcon({
  status,
  slow,
}: {
  status: ContractType['status'];
  slow: boolean;
}) {
  const ended = status === 'cancelled' || status === 'expired';
  const Icon = ended
    ? CircleXIcon
    : status === 'failed'
      ? TriangleAlertIcon
      : slow || status === 'pending_signature'
        ? ClockIcon
        : LoaderCircleIcon;

  return (
    <span
      className={cn(
        'flex size-16 items-center justify-center rounded-full',
        ended || status === 'failed'
          ? 'bg-destructive/10 text-destructive'
          : 'bg-warning/15 text-warning-foreground dark:text-warning',
      )}
    >
      <Icon
        className={cn(
          'size-8',
          Icon === LoaderCircleIcon &&
            'animate-spin motion-reduce:animate-none',
        )}
      />
    </span>
  );
}
