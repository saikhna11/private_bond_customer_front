import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/components/common/form-field';
import { Input } from '@/components/ui/input';
import { FormSection } from './form-section';
import type { BondRequestValues } from './use-bond-request-form';

/** The first and the last day of sales; no last day sells until sold out or closed. */
export function SaleFields({
  form,
}: {
  form: UseFormReturn<BondRequestValues>;
}) {
  const { t } = useTranslation();
  const { errors } = form.formState;
  return (
    <FormSection title={t('issuer.bonds.form.sections.sale')}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField
          id="sale_start"
          label={t('issuer.bonds.form.saleStart')}
          error={errors.sale_start?.message}
        >
          <Input
            id="sale_start"
            type="date"
            className="h-10"
            aria-invalid={!!errors.sale_start}
            {...form.register('sale_start')}
          />
        </FormField>
        <FormField
          id="sale_end"
          label={t('issuer.bonds.form.saleEnd')}
          optional
          error={errors.sale_end?.message}
        >
          <Input
            id="sale_end"
            type="date"
            className="h-10"
            aria-invalid={!!errors.sale_end}
            {...form.register('sale_end')}
          />
        </FormField>
      </div>
    </FormSection>
  );
}
