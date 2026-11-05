import { useTranslation } from 'react-i18next';
import { FormField } from '@/components/common/form-field';
import type { BondType } from '@/queries/bond/type';
import { formatMoney } from '../format';
import { BuySection } from './buy-section';
import { CoHolderFields } from './co-holder-fields';
import { OptionPicker } from './option-picker';
import { OwnershipPicker } from './ownership-picker';
import { PurchaseSummary } from './purchase-summary';
import { PurchaseTotal } from './purchase-total';
import { QuantityField } from './quantity-field';
import { TermPicker } from './term-picker';
import { usePurchaseForm } from './use-purchase-form';

/**
 * Buying a bond, step by step on the left: the rate option and term, how many bonds, and
 * who holds them; on the right, what the purchase comes to, checked by the backend, and the
 * payment.
 */
export function BuyForm({ bond }: { bond: BondType }) {
  const { t } = useTranslation();
  const form = usePurchaseForm(bond);
  const price = formatMoney(form.unit, bond.currency);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="flex min-w-0 flex-col gap-6">
        <BuySection
          step={1}
          title={t('bond.buy.sections.terms')}
          description={t('bond.buy.sections.termsText')}
        >
          <OptionPicker
            options={bond.rate_options}
            value={form.option?.id ?? ''}
            onChange={form.pickOption}
          />
          <FormField id="term" label={t('bond.term')}>
            <TermPicker
              id="term"
              terms={form.terms}
              value={form.term}
              onChange={form.setTerm}
            />
          </FormField>
        </BuySection>
        <BuySection
          step={2}
          title={t('bond.buy.sections.quantity')}
          description={t('bond.buy.sections.quantityText', { price })}
        >
          <div className="grid items-start gap-4 sm:grid-cols-2">
            <FormField
              id="quantity"
              label={t('bond.buy.quantity')}
              error={form.errors.quantity}
            >
              <QuantityField
                id="quantity"
                value={form.quantity}
                min={form.minQuantity}
                max={form.maxQuantity}
                onChange={form.setQuantity}
                invalid={!!form.errors.quantity}
              />
              <p className="text-xs text-muted-foreground">
                {t('bond.buy.quantityHint', {
                  min: form.minQuantity,
                  max: form.maxQuantity,
                })}
              </p>
            </FormField>
            <PurchaseTotal
              quantity={form.quantity}
              unit={form.unit}
              currency={bond.currency}
              className="lg:hidden"
            />
          </div>
        </BuySection>
        {form.ownerships.length > 1 && (
          <BuySection
            step={3}
            title={t('bond.buy.sections.ownership')}
            description={t('bond.buy.sections.ownershipText')}
          >
            <OwnershipPicker
              options={form.ownerships}
              value={form.ownership}
              onChange={form.setOwnership}
            />
            {form.ownership === 'joint' && <CoHolderFields form={form} />}
          </BuySection>
        )}
      </div>
      <PurchaseSummary bond={bond} form={form} />
    </div>
  );
}
