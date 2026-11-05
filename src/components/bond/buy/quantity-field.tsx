import { MinusIcon, PlusIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * How many bonds the client buys: typed, or stepped one at a time between min and max.
 * An empty field is undefined.
 */
export function QuantityField({
  id,
  value,
  min,
  max,
  onChange,
  invalid,
}: {
  id: string;
  value: number | undefined;
  min: number;
  max: number;
  onChange: (quantity: number | undefined) => void;
  invalid?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11 shrink-0 rounded-xl"
        aria-label={t('bond.buy.less')}
        disabled={!value || value <= min}
        onClick={() => onChange(Math.max(min, (value ?? min) - 1))}
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
            const digits = e.target.value.replace(/[^0-9]/g, '');
            onChange(digits ? Number(digits) : undefined);
          }}
        />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-muted-foreground">
          {t('bond.buy.pieces')}
        </span>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11 shrink-0 rounded-xl"
        aria-label={t('bond.buy.more')}
        disabled={value !== undefined && value >= max}
        onClick={() => onChange(Math.min(max, (value ?? min - 1) + 1))}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
