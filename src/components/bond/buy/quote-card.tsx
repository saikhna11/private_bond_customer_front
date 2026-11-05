import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import { quoteOptions } from '@/queries/bond/options';
import type { BondType, PurchaseBody, QuoteType } from '@/queries/bond/type';
import { formatMoney, frequencyText, percent } from '../format';
import { PayButton } from './pay-button';

/**
 * What the purchase would be if paid today, checked by the backend as the purchase will be
 * (its remainder and the investor cap among them), and the button that pays it. It has no
 * schedule yet: the contract's annex prints the sample one.
 */
export function QuoteCard({
  bond,
  body,
}: {
  bond: BondType;
  body: PurchaseBody | undefined;
}) {
  const { t } = useTranslation();
  const quote = useQuery({
    ...quoteOptions(bond.id, body as PurchaseBody),
    enabled: !!body,
  });

  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader>
        <CardTitle>{t('bond.quote.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!body ? (
          <p className="text-sm text-muted-foreground">
            {t('bond.quote.fill')}
          </p>
        ) : quote.isPending ? (
          <Skeleton className="h-48 w-full" />
        ) : quote.error ? (
          <ApiErrorAlert error={toApiError(quote.error)} />
        ) : (
          <QuoteFacts quote={quote.data} />
        )}
        <PayButton
          bond={bond}
          body={quote.data && body ? body : undefined}
          disabled={!quote.data || quote.isFetching}
        />
        <p className="text-xs text-muted-foreground">{t('bond.quote.mock')}</p>
      </CardContent>
    </Card>
  );
}

function QuoteFacts({ quote: q }: { quote: QuoteType }) {
  const { t } = useTranslation();
  const rows = [
    { label: t('bond.quote.amount'), value: formatMoney(q.amount, q.currency) },
    { label: t('bond.rate'), value: percent(q.annual_rate) },
    { label: t('bond.frequency'), value: frequencyText(q.interest_frequency) },
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
