import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import type { BondType } from '@/queries/bond/type';
import { formatMoney } from '../format';

const grouping = new Intl.NumberFormat('en-US');

/**
 * The amount, typed with thousands separators and kept as plain digits, and steps to add
 * or take one purchase unit.
 */
export function AmountField({
  id,
  bond,
  value,
  onChange,
  invalid,
}: {
  id: string;
  bond: BondType;
  value: string;
  onChange: (digits: string) => void;
  invalid?: boolean;
}) {
  const { t } = useTranslation();
  const shown = value ? grouping.format(Number(value)) : '';
  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          className="tabular h-10 pr-14"
          aria-invalid={invalid}
          value={shown}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
          {bond.currency}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        {t('bond.buy.amountHint', {
          min: formatMoney(bond.min_purchase, bond.currency),
          unit: formatMoney(bond.purchase_unit, bond.currency),
          remaining: formatMoney(bond.remaining, bond.currency),
        })}
      </p>
    </div>
  );
}
