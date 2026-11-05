import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { TermSelect } from './term-select';

/** The most terms shown as buttons; an option offering more lists them in a select. */
const maxChips = 8;

/** The terms the picked option offers, one picked: as buttons, or a select when many. */
export function TermPicker({
  id,
  terms,
  value,
  onChange,
}: {
  id: string;
  terms: number[];
  value: number | undefined;
  onChange: (months: number) => void;
}) {
  const { t } = useTranslation();
  if (terms.length > maxChips) {
    return (
      <TermSelect id={id} terms={terms} value={value} onChange={onChange} />
    );
  }
  return (
    <fieldset
      id={id}
      aria-label={t('bond.term')}
      className="m-0 flex min-w-0 flex-wrap gap-2 border-0 p-0"
    >
      {terms.map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={m === value}
          onClick={() => onChange(m)}
          className={cn(
            'tabular h-10 rounded-lg border px-4 text-sm font-medium transition-colors hover:bg-muted/60',
            m === value &&
              'border-primary bg-primary/5 text-primary ring-2 ring-primary/15 hover:bg-primary/5',
          )}
        >
          {t('contract.months', { count: m })}
        </button>
      ))}
    </fieldset>
  );
}
