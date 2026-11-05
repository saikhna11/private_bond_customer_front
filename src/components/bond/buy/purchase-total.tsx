import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { formatMoney } from '../format';

/**
 * What the bonds cost: quantity times the price of one, and the amount in large type, or a
 * dash while no quantity is typed.
 */
export function PurchaseTotal({
  quantity,
  unit,
  currency,
  className,
}: {
  quantity: number | undefined;
  unit: number;
  currency: string;
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <div className={cn('rounded-xl bg-primary/6 px-4 py-3', className)}>
      <p className="text-xs text-muted-foreground">{t('bond.buy.total')}</p>
      <p className="tabular text-2xl font-bold tracking-tight text-primary">
        {quantity ? formatMoney(quantity * unit, currency) : '-'}
      </p>
      <p className="tabular text-xs text-muted-foreground">
        {t('bond.buy.perPiece', {
          count: quantity ?? 0,
          price: formatMoney(unit, currency),
        })}
      </p>
    </div>
  );
}
