import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react'; // <-- Icon нэмсэн
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

  // Хязгаарт хүрсэн эсэхийг шалгах
  const hasQuantityError = !!form.errors.quantity;

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

        {hasQuantityError && (
          <div className="flex items-start gap-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p className="font-medium">{form.errors.quantity}</p>
          </div>
        )}

        {!body ? (
          !hasQuantityError && ( // Хэрэв алдаа байхгүй бол л "Бөглөнө үү" гэж харуулна
            <p className="text-sm text-muted-foreground">
              {t('bond.quote.fill')}
            </p>
          )
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
          disabled={!quote.data || quote.isFetching || hasQuantityError}
        />
        <p className="text-xs text-muted-foreground">{t('bond.quote.mock')}</p>
      </CardContent>
    </Card>
  );
}
