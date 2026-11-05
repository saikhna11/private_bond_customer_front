import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { BuyOwnership } from './use-purchase-form';

/** Whether the client buys alone or with a co-holder, of the kinds on sale. */
export function OwnershipPicker({
  options,
  value,
  onChange,
}: {
  options: BuyOwnership[];
  value: BuyOwnership;
  onChange: (o: BuyOwnership) => void;
}) {
  const { t } = useTranslation();
  return (
    <fieldset
      aria-label={t('bond.buy.ownership')}
      className="m-0 flex h-10 w-full min-w-0 gap-1 rounded-lg border-0 bg-muted p-1"
    >
      {options.map((o) => (
        <button
          key={o}
          type="button"
          aria-pressed={o === value}
          onClick={() => onChange(o)}
          className={cn(
            'flex-1 rounded-md text-sm text-muted-foreground transition-colors',
            o === value && 'bg-background text-foreground shadow-sm',
          )}
        >
          {t(`bond.ownership.${o}`)}
        </button>
      ))}
    </fieldset>
  );
}
