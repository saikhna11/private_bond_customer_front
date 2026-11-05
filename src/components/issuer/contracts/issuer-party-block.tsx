import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/** How a party's part in the contract reads: signed, declined, awaited, or neither. */
export type PartyTone = 'done' | 'declined' | 'awaited' | 'none';

const tones: Record<PartyTone, string> = {
  done: 'bg-success/12 text-success',
  declined: 'bg-destructive/10 text-destructive',
  awaited: 'bg-warning/15 text-warning-foreground dark:text-warning',
  none: 'bg-muted text-muted-foreground',
};

/**
 * One of the contract's three parties: what it is, who, more about them (lines), and where
 * its signature stands (state, in tone).
 */
export function IssuerPartyBlock({
  Icon,
  label,
  name,
  lines,
  state,
  tone,
}: {
  Icon: LucideIcon;
  label: string;
  name: string;
  lines: string[];
  state: string;
  tone: PartyTone;
}) {
  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate font-medium">{name}</p>
        {lines.map((line) => (
          <p key={line} className="truncate text-xs text-muted-foreground">
            {line}
          </p>
        ))}
      </div>
      <span
        className={cn(
          'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium',
          tones[tone],
        )}
      >
        {state}
      </span>
    </li>
  );
}
