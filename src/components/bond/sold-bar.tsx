import { useTranslation } from 'react-i18next';
import type { BondType } from '@/queries/bond/type';
import { formatMoney } from './format';

/** How much of a bond is sold, as a bar, and what remains. */
export function SoldBar({ bond }: { bond: BondType }) {
  const { t } = useTranslation();
  const total = Number(bond.total_amount);
  const share =
    total > 0 ? Math.min(100, (Number(bond.sold) / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${share}%` }}
        />
      </div>
      <div className="flex justify-between gap-3 text-xs text-muted-foreground">
        <span>{t('bond.soldShare', { share: Math.floor(share) })}</span>
        <span className="tabular">
          {t('bond.remaining')}: {formatMoney(bond.remaining, bond.currency)}
        </span>
      </div>
    </div>
  );
}
