import { useTranslation } from 'react-i18next';
import type { QuoteType } from '@/queries/bond/type';
import { frequencyText, percent } from '../format';

/** The terms the backend quoted: the option, its rate and term, the tax, and the dates. */
export function QuoteFacts({ quote: q }: { quote: QuoteType }) {
  const { t } = useTranslation();
  const rows = [
    { label: t('bond.frequency'), value: frequencyText(q.interest_frequency) },
    { label: t('bond.rate'), value: percent(q.annual_rate) },
    {
      label: t('bond.term'),
      value: t('contract.months', { count: q.term_months }),
    },
    { label: t('bond.quote.tax'), value: percent(q.tax_rate) },
    { label: t('bond.quote.start'), value: q.start_date },
    { label: t('bond.quote.maturity'), value: q.maturity_date },
  ];
  return (
    <dl className="divide-y text-sm">
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between gap-3 py-2">
          <dt className="text-muted-foreground">{r.label}</dt>
          <dd className="tabular text-right font-medium">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
