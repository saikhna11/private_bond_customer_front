import { cn } from '@/lib/utils';

/** One labelled fact of a contract, in a tile; a long value, such as an IBAN, wraps. */
export function IssuerFact({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn('min-w-0 rounded-xl bg-muted/60 px-3 py-2', className)}>
      <dt className="truncate text-xs text-muted-foreground">{label}</dt>
      <dd className="tabular font-medium [overflow-wrap:anywhere]">
        {value || '-'}
      </dd>
    </div>
  );
}
