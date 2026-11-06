import { Controller, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormSection } from './form-section';
import { InterestMethodCards } from './interest-method-cards';
import { RateOptionMatrix } from './rate-option-matrix';
import type { BondRequestValues } from './use-bond-request-form';

/** How interest is counted and the rate matrix (bond.md 4). */
export function InterestFields({
  form,
}: {
  form: UseFormReturn<BondRequestValues>;
}) {
  const { t } = useTranslation();
  return (
    <FormSection title={t('issuer.bonds.form.sections.interest')}>
      <Controller
        control={form.control}
        name="interest_method"
        render={({ field }) => (
          <InterestMethodCards value={field.value} onChange={field.onChange} />
        )}
      />
      <div className="mt-4">
        <RateOptionMatrix form={form} />
      </div>
    </FormSection>
  );
}
