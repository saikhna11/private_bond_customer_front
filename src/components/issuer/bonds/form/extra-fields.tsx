import { Controller, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/components/common/form-field';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormSection } from './form-section';
import { PercentInput } from './percent-input';
import type { BondRequestValues } from './use-bond-request-form';

/** The fees, the issuer's payment time, the guarantee and the introduction text. */
export function ExtraFields({
  form,
}: {
  form: UseFormReturn<BondRequestValues>;
}) {
  const { t } = useTranslation();
  const { errors } = form.formState;
  return (
    <FormSection title={t('issuer.bonds.form.sections.extra')}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField
          id="exit_fee_rate"
          label={t('issuer.bonds.form.exitFee')}
          error={errors.exit_fee_rate?.message}
        >
          <PercentInput
            id="exit_fee_rate"
            aria-invalid={!!errors.exit_fee_rate}
            {...form.register('exit_fee_rate')}
          />
        </FormField>
        <FormField
          id="penalty_rate"
          label={t('issuer.bonds.form.penalty')}
          error={errors.penalty_rate?.message}
        >
          <PercentInput
            id="penalty_rate"
            aria-invalid={!!errors.penalty_rate}
            {...form.register('penalty_rate')}
          />
        </FormField>
        <FormField
          id="issuer_cutoff"
          label={t('issuer.bonds.form.cutoff')}
          hint={t('issuer.bonds.form.cutoffHint')}
          error={errors.issuer_cutoff?.message}
        >
          <Input
            id="issuer_cutoff"
            type="time"
            className="h-10"
            aria-invalid={!!errors.issuer_cutoff}
            {...form.register('issuer_cutoff')}
          />
        </FormField>
        <FormField id="has_guarantee" label={t('issuer.bonds.form.guarantee')}>
          <Controller
            control={form.control}
            name="has_guarantee"
            render={({ field }) => (
              <label
                htmlFor="has_guarantee"
                className="flex h-10 cursor-pointer items-center gap-2.5 rounded-md border border-input px-3 text-sm shadow-xs transition-colors hover:bg-muted/50 has-data-[state=checked]:border-primary/60 has-data-[state=checked]:bg-primary/5 dark:bg-input/30"
              >
                <Checkbox
                  id="has_guarantee"
                  checked={field.value}
                  onCheckedChange={(c) => field.onChange(c === true)}
                />
                {t('issuer.bonds.form.guaranteeLabel')}
              </label>
            )}
          />
        </FormField>
      </div>
      <FormField
        id="prospectus"
        label={t('issuer.bonds.form.prospectus')}
        optional
        error={errors.prospectus?.message}
      >
        <Textarea
          id="prospectus"
          rows={5}
          aria-invalid={!!errors.prospectus}
          {...form.register('prospectus')}
        />
      </FormField>
    </FormSection>
  );
}
