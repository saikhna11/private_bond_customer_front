import { Controller, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/components/common/form-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CurrencySchema } from '@/queries/issuer-bond/type';
import { AmountInput } from './amount-input';
import { FormSection } from './form-section';
import type { BondRequestValues } from './use-bond-request-form';

type AmountName = 'total_amount' | 'min_purchase' | 'investor_cap';

/** The currency, the purchase unit and the amounts, all multiples of the unit (bond.md 3.2). */
export function AmountFields({
  form,
}: {
  form: UseFormReturn<BondRequestValues>;
}) {
  const { t } = useTranslation();
  const { errors } = form.formState;
  const currency = form.watch('currency');

  const amountField = (name: AmountName, label: string, hint?: string) => (
    <FormField
      id={name}
      label={label}
      hint={hint}
      error={errors[name]?.message}
      optional={name === 'investor_cap'}
    >
      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <AmountInput
            id={name}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            currency={currency}
            aria-invalid={!!errors[name]}
          />
        )}
      />
    </FormField>
  );

  return (
    <FormSection title={t('issuer.bonds.form.sections.amounts')}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField id="currency" label={t('issuer.bonds.form.currency')}>
          <Controller
            control={form.control}
            name="currency"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="currency" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CurrencySchema.options.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
        <FormField
          id="purchase_unit"
          label={t('issuer.bonds.form.purchaseUnit')}
          hint={t('issuer.bonds.form.purchaseUnitHint')}
          error={errors.purchase_unit?.message}
        >
          <Controller
            control={form.control}
            name="purchase_unit"
            render={({ field }) => (
              <AmountInput
                id="purchase_unit"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                currency={currency}
                aria-invalid={!!errors.purchase_unit}
              />
            )}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {amountField('min_purchase', t('issuer.bonds.form.minPurchase'))}
        {amountField(
          'investor_cap',
          t('issuer.bonds.form.investorCap'),
          t('issuer.bonds.form.investorCapHint'),
        )}
      </div>
      {amountField('total_amount', t('issuer.bonds.form.totalAmount'))}
    </FormSection>
  );
}
