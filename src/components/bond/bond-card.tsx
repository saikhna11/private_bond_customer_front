import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import type { BondType } from '@/queries/bond/type';
import { BondCover } from './bond-cover';
import { BondStatusBadge } from './bond-status-badge';
import { rateRange, termRange } from './format';
import { SoldBar } from './sold-bar';

/** One bond on offer: its cover, status, name, rates, terms and what remains of it. */
export function BondCard({ bond }: { bond: BondType }) {
  const { t } = useTranslation();
  return (
    <Link
      to="/bonds/$bondId"
      params={{ bondId: bond.id }}
      className="group rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <Card className="h-full gap-0 overflow-hidden py-0 transition-all group-hover:-translate-y-px group-hover:border-primary/40 group-hover:shadow-sm motion-reduce:group-hover:translate-y-0">
        <BondCover bond={bond} className="aspect-[16/7]" />
        <CardContent className="flex flex-1 flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold">{bond.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {bond.bond_issuer_name}
              </p>
            </div>
            <BondStatusBadge status={bond.sales_status} />
          </div>
          <dl className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-xl bg-muted/60 px-3 py-2">
              <dt className="text-xs text-muted-foreground">
                {t('bond.rate')}
              </dt>
              <dd className="tabular font-semibold text-primary">
                {rateRange(bond.rate_options)}
              </dd>
            </div>
            <div className="rounded-xl bg-muted/60 px-3 py-2">
              <dt className="text-xs text-muted-foreground">
                {t('bond.term')}
              </dt>
              <dd className="tabular font-semibold">
                {termRange(bond.rate_options)}
              </dd>
            </div>
            <div className="rounded-xl bg-muted/60 px-3 py-2">
              <dt className="text-xs text-muted-foreground">
                {t('bond.currency')}
              </dt>
              <dd className="font-semibold">{bond.currency}</dd>
            </div>
          </dl>
          <div className="mt-auto">
            <SoldBar bond={bond} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
