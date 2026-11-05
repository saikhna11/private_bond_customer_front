import { Link } from '@tanstack/react-router';
import { ShoppingCartIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { BondType } from '@/queries/bond/type';
import { BondCover } from './bond-cover';
import { BondStatusBadge } from './bond-status-badge';
import { rateRange, termRange } from './format';
import { SoldBar } from './sold-bar';

/** A bond's cover, name, issuer, status, rates and terms, and the way to buy it. */
export function BondHeader({ bond }: { bond: BondType }) {
  const { t } = useTranslation();
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="grid md:grid-cols-[2fr_3fr]">
        <BondCover bond={bond} className="aspect-[16/9] md:aspect-auto" />
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-muted-foreground">
              {bond.code}
            </span>
            <BondStatusBadge status={bond.sales_status} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {bond.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('bond.issuer')}: {bond.bond_issuer_name}
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="tabular text-3xl font-bold text-primary">
                {rateRange(bond.rate_options)}
              </p>
              <p className="text-xs text-muted-foreground">{t('bond.rate')}</p>
            </div>
            <div>
              <p className="tabular text-3xl font-bold">
                {termRange(bond.rate_options)}
              </p>
              <p className="text-xs text-muted-foreground">{t('bond.term')}</p>
            </div>
          </div>
          <SoldBar bond={bond} />
          {bond.sales_status === 'selling' && (
            <Button asChild className="h-11 self-start rounded-xl px-6">
              <Link to="/bonds/$bondId/buy" params={{ bondId: bond.id }}>
                <ShoppingCartIcon />
                {t('bond.buy.cta')}
              </Link>
            </Button>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
