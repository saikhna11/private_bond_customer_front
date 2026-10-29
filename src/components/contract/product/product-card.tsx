import { LandmarkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { frequencyLabel } from '@/components/contract/format';
import { Card, CardContent } from '@/components/ui/card';
import type {
  BondProductType,
  PurchasableOwnership,
} from '@/queries/contract/type';
import { ProductOptionRow } from './product-option-row';

/** One bond on sale: its rate and terms, and the kinds of contract it is sold under. */
export function ProductCard({
  product: p,
  onPick,
}: {
  product: BondProductType;
  onPick: (ownership: PurchasableOwnership) => void;
}) {
  const { t } = useTranslation();
  return (
    <Card className="group py-0 transition-all hover:-translate-y-px hover:border-primary/40 hover:shadow-sm motion-reduce:hover:translate-y-0">
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
            <LandmarkIcon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              {t('contract.bond', { name: p.name })}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('contract.product.kinds', { count: p.options.length })}
            </p>
          </div>
          <div className="text-right">
            <p className="tabular text-2xl font-bold text-primary">
              {Number(p.annual_rate)}%
            </p>
            <p className="text-xs text-muted-foreground">
              {t('contract.product.annualRate')}
            </p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-muted/60 px-3 py-2">
            <dt className="text-xs text-muted-foreground">
              {t('contract.product.term')}
            </dt>
            <dd className="tabular font-semibold">
              {t('contract.months', { count: p.term_months })}
            </dd>
          </div>
          <div className="rounded-xl bg-muted/60 px-3 py-2">
            <dt className="text-xs text-muted-foreground">
              {t('contract.product.frequency')}
            </dt>
            <dd className="font-semibold">
              {frequencyLabel(p.interest_frequency)}
            </dd>
          </div>
        </dl>
        {p.options.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground">
            {t('contract.product.noTemplate')}
          </p>
        ) : (
          <ul className="divide-y border-t">
            {p.options.map((o) => (
              <ProductOptionRow
                key={`${o.ownership_type}-${o.ttd}`}
                option={o}
                onPick={onPick}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
