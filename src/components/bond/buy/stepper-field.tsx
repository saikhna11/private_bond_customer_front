import { MinusIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * A number typed, or stepped with minus and plus: onLess and onMore are what those give,
 * undefined while they cannot step. A cleared field gives emptyValue (undefined unless
 * given); digits caps its length.
 */
export function StepperField({
  id,
  value,
  onChange,
  onLess,
  onMore,
  suffix,
  lessLabel,
  moreLabel,
  digits,
  emptyValue,
  invalid,
}: {
  id: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  onLess: number | undefined;
  onMore: number | undefined;
  suffix: string;
  lessLabel: string;
  moreLabel: string;
  digits: number;
  emptyValue?: number;
  invalid?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11 shrink-0 rounded-xl"
        aria-label={lessLabel}
        disabled={onLess === undefined}
        onClick={() => onChange(onLess)}
      >
        <MinusIcon />
      </Button>
      <div className="relative min-w-0 flex-1">
        <Input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          className="tabular h-11 rounded-xl pr-16 text-center text-lg font-semibold"
          aria-invalid={invalid}
          value={value ?? ''}
          onChange={(e) => {
            const d = e.target.value.replace(/[^0-9]/g, '').slice(0, digits);
            onChange(d ? Number(d) : emptyValue);
          }}
        />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-muted-foreground">
          {suffix}
        </span>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11 shrink-0 rounded-xl"
        aria-label={moreLabel}
        disabled={onMore === undefined}
        onClick={() => onChange(onMore)}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
