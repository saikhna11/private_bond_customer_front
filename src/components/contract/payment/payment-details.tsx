import { InfoIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PaymentType } from '@/queries/contract/type';
import { formatAmount, formatMoney } from '../format';
import { PaymentField } from './payment-field';

/** Where and how the client pays their order: the company account, the amount, the reference. */
export function PaymentDetails({ payment }: { payment: PaymentType }) {
  const { t } = useTranslation();
  const a = payment.account;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('contract.payment.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {a ? (
          <>
            <PaymentField
              label={t('contract.payment.recipient')}
              value={a.account_name}
            />
            <PaymentField
              label={t('contract.payment.bank')}
              value={a.bank_name}
            />
            <PaymentField
              label={t('contract.payment.account')}
              value={a.account_number}
            />
            <PaymentField label={t('contract.payment.iban')} value={a.iban} />
          </>
        ) : (
          <Alert variant="destructive">
            <InfoIcon />
            <AlertDescription>
              {t('contract.payment.noAccount')}
            </AlertDescription>
          </Alert>
        )}
        <PaymentField
          label={t('contract.payment.amount')}
          value={formatMoney(payment.amount, payment.currency)}
          copy={formatAmount(payment.amount)
            .replace(/,/g, '')
            .replace(/\.00$/, '')}
          strong
        />
        <PaymentField
          label={t('contract.payment.reference')}
          value={payment.reference}
          strong
        />
        <p className="text-xs text-muted-foreground">
          {t('contract.payment.referenceHint')}
        </p>
      </CardContent>
    </Card>
  );
}
