import { ArrowRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  type ProductOptionType,
  type PurchasableOwnership,
  purchasableOwnershipSchema,
} from '@/queries/contract/type';

/**
 * One kind of contract a bond is sold under, with the button to buy it; disabled while it
 * cannot be bought.
 */
export function ProductOptionRow({
  option: o,
  onPick,
}: {
  option: ProductOptionType;
  onPick: (ownership: PurchasableOwnership) => void;
}) {
  const { t } = useTranslation();
  const ownership = purchasableOwnershipSchema.safeParse(o.ownership_type);
  const open = o.available && ownership.success;
  return (
    <li className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm font-medium">
        {t(`contract.product.ownership.${o.ownership_type}`)}
        {o.ttd && (
          <span className="text-muted-foreground">
            {' · '}
            {t('contract.product.ttd')}
          </span>
        )}
      </span>
      <Button
        size="sm"
        variant={open ? 'default' : 'outline'}
        className="rounded-lg"
        disabled={!open}
        onClick={() => ownership.success && onPick(ownership.data)}
      >
        {t('contract.product.buy')}
        <ArrowRightIcon />
      </Button>
    </li>
  );
}
