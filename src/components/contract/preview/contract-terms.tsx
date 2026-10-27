import {
  BanknoteIcon,
  CalendarCheckIcon,
  CalendarRangeIcon,
  HashIcon,
  PercentIcon,
  RepeatIcon,
} from 'lucide-react';
import { formatAmount, frequencyLabels } from '@/components/contract/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProductPreviewType } from '@/queries/contract/type';

/** The previewed contract's key terms, one tile each. */
export function ContractTerms({ preview }: { preview: ProductPreviewType }) {
  const terms = [
    { label: 'Гэрээний дугаар', value: preview.contract_no, Icon: HashIcon },
    {
      label: 'Дүн',
      value: `${formatAmount(preview.principal_amount)} ₮`,
      Icon: BanknoteIcon,
    },
    {
      label: 'Жилийн хүү',
      value: `${Number(preview.annual_rate)}%`,
      Icon: PercentIcon,
    },
    {
      label: 'Хугацаа',
      value: `${preview.term_months} сар`,
      Icon: CalendarRangeIcon,
    },
    {
      label: 'Хүү төлөх',
      value: frequencyLabels[preview.interest_frequency],
      Icon: RepeatIcon,
    },
    {
      label: 'Дуусах огноо',
      value: preview.maturity_date,
      Icon: CalendarCheckIcon,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Гэрээний нөхцөл</CardTitle>
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
