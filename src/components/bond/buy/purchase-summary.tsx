import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import { quoteOptions } from '@/queries/bond/options';
import type { BondType, PurchaseBody } from '@/queries/bond/type';
import { PayButton } from './pay-button';
import { PurchaseTotal } from './purchase-total';
import { QuoteFacts } from './quote-facts';
import type { PurchaseForm } from './use-purchase-form';

/**
 * What the purchase comes to: its bonds and amount as the client picks them, then, checked
 * by the backend as the purchase will be (the remainder and the investor cap among them),
 * its terms if paid today, and the button that pays it. It has no schedule yet: the
 * contract's annex prints the sample one.
 */
export function PurchaseSummary({
  bond,
  form,
}: {
  bond: BondType;
  form: PurchaseForm;
}) {
  const { t } = useTranslation();
  const { body } = form;
  const quote = useQuery({
    ...quoteOptions(bond.id, body as PurchaseBody),
    enabled: !!body,
  });

  return (
    <Card className="lg:sticky lg:top-20">
      <CardHeader>
        <CardTitle>{t('bond.quote.title')}</CardTitle>
        <CardDescription>
          {bond.name} · {bond.code}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PurchaseTotal
          quantity={form.quantity}
          unit={form.unit}
          currency={bond.currency}
        />
        {!body ? (
          <p className="text-sm text-muted-foreground">
            {t('bond.quote.fill')}
          </p>
        ) : quote.isPending ? (
          <Skeleton className="h-40 w-full" />
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
