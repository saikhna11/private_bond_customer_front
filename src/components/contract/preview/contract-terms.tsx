import {
  BanknoteIcon,
  CalendarCheckIcon,
  CalendarRangeIcon,
  HashIcon,
  PercentIcon,
  RepeatIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  contractNumber,
  formatAmount,
  frequencyLabel,
} from '@/components/contract/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContractType } from '@/queries/contract/type';

/** The key terms a contract, or the preview of one, carries. */
export type ContractTermsSource = Pick<
  ContractType,
  | 'principal_amount'
  | 'annual_rate'
  | 'term_months'
  | 'interest_frequency'
  | 'maturity_date'
> & { contract_no?: string };

/** A contract's key terms, one tile each. */
export function ContractTerms({ terms: c }: { terms: ContractTermsSource }) {
  const { t } = useTranslation();
  const terms = [
    {
      label: t('contract.terms.contractNo'),
      value: contractNumber(c),
      Icon: HashIcon,
    },
    {
      label: t('contract.terms.amount'),
      value: `${formatAmount(c.principal_amount)} ₮`,
      Icon: BanknoteIcon,
    },
    {
      label: t('contract.terms.annualRate'),
      value: `${Number(c.annual_rate)}%`,
      Icon: PercentIcon,
    },
    {
      label: t('contract.terms.term'),
      value: t('contract.months', { count: c.term_months }),
      Icon: CalendarRangeIcon,
    },
    {
      label: t('contract.terms.frequency'),
      value: frequencyLabel(c.interest_frequency),
      Icon: RepeatIcon,
    },
    {
      label: t('contract.terms.maturity'),
      value: c.maturity_date,
      Icon: CalendarCheckIcon,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('contract.terms.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {terms.map(({ label, value, Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl bg-muted/60 p-3"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <dt className="truncate text-xs text-muted-foreground">
                  {label}
                </dt>
                <dd className="tabular truncate font-semibold">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
