import { ShieldCheckIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/format';
import type { BondType } from '@/queries/bond/type';
import { formatMoney } from './format';

/**
 * A bond's amounts and sales dates, and whether it is guaranteed. A client buys whole bonds
 * at the purchase unit's price (bond.md 3.2), so the amounts also read as bonds.
 */
export function BondFacts({ bond }: { bond: BondType }) {
  const { t } = useTranslation();
  const money = (v: string) => formatMoney(v, bond.currency);
  const unit = Number(bond.purchase_unit);
  const pieces = (v: string) =>
    t('bond.facts.pieces', { count: Math.floor(Number(v) / unit) });
  const facts: { label: string; value: string; hint?: string }[] = [
    { label: t('bond.facts.unit'), value: money(bond.purchase_unit) },
    {
      label: t('bond.facts.minPurchase'),
      value: pieces(bond.min_purchase),
      hint: money(bond.min_purchase),
    },
    {
      label: t('bond.facts.total'),
      value: money(bond.total_amount),
      hint: pieces(bond.total_amount),
    },
    {
      label: t('bond.facts.remaining'),
      value: money(bond.remaining),
      hint: pieces(bond.remaining),
    },
    {
      label: t('bond.facts.cap'),
      value: bond.investor_cap
        ? pieces(bond.investor_cap)
        : t('bond.facts.noCap'),
      hint: bond.investor_cap ? money(bond.investor_cap) : undefined,
    },
    {
      label: t('bond.facts.sale'),
      value: bond.sale_end
        ? `${formatDate(bond.sale_start)} - ${formatDate(bond.sale_end)}`
        : t('bond.facts.saleOpen', { from: formatDate(bond.sale_start) }),
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('bond.facts.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-3 sm:grid-cols-2">
          {facts.map((f) => (
            <div key={f.label} className="rounded-xl bg-muted/60 px-3 py-2">
              <dt className="text-xs text-muted-foreground">{f.label}</dt>
              <dd className="tabular font-semibold">{f.value}</dd>
              {f.hint && (
                <dd className="tabular text-xs text-muted-foreground">
                  {f.hint}
                </dd>
              )}
            </div>
          ))}
        </dl>
        {bond.has_guarantee && (
          <p className="flex items-center gap-2 text-sm text-success">
            <ShieldCheckIcon className="size-4" />
            {t('bond.facts.guarantee')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
