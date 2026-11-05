import { CheckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { RateOptionType } from '@/queries/bond/type';
import { frequencyText, percent } from '../format';

/** The bond's rate options as cards, one picked. */
export function OptionPicker({
  options,
  value,
  onChange,
}: {
  options: RateOptionType[];
  value: string;
  onChange: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <fieldset
      aria-label={t('bond.buy.option')}
      className="m-0 grid min-w-0 gap-3 border-0 p-0 sm:grid-cols-2"
    >
      {options.map((o) => {
        const picked = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={picked}
            onClick={() => onChange(o.id)}
            className={cn(
              'relative flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors hover:bg-muted/50',
              picked && 'border-primary bg-primary/5 ring-2 ring-primary/15',
            )}
          >
            <div className="min-w-0">
              <p className="font-medium">
                {frequencyText(o.interest_frequency)}
              </p>
              <p className="tabular text-sm text-muted-foreground">
                {o.term_min_months === o.term_max_months
                  ? t('contract.months', { count: o.term_min_months })
                  : t('bond.monthsRange', {
                      from: o.term_min_months,
                      to: o.term_max_months,
                    })}
              </p>
            </div>
            <span className="tabular text-xl font-bold text-primary">
              {percent(o.annual_rate)}
            </span>
            {picked && (
              <CheckIcon className="absolute top-2 right-2 size-3.5 text-primary" />
            )}
          </button>
        );
      })}
    </fieldset>
  );
}
