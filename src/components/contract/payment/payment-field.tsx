import { CopyButton } from '@/components/common/copy-button';
import { cn } from '@/lib/utils';

/**
 * One line of the payment details: its label, its value and a copy button. strong marks the
 * amount and the reference, which the client must get exactly right.
 */
export function PaymentField({
  label,
  value,
  copy = value,
  strong = false,
}: {
  label: string;
  value: string;
  copy?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2">
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div
          className={cn(
            'tabular [overflow-wrap:anywhere]',
            strong ? 'text-base font-semibold text-primary' : 'font-medium',
          )}
        >
          {value}
        </div>
      </div>
      <CopyButton value={copy} label={label} />
    </div>
  );
}
