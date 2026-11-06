import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/components/common/form-field';
import { Input } from '@/components/ui/input';
import { FormSection } from './form-section';
import type { BondRequestValues } from './use-bond-request-form';

/** The bond's code, which starts every contract number, and its name. */
export function GeneralFields({
  form,
}: {
  form: UseFormReturn<BondRequestValues>;
}) {
  const { t } = useTranslation();
  const { errors } = form.formState;
  return (
    <FormSection title={t('issuer.bonds.form.sections.general')}>
      <div className="flex gap-5">
        <FormField
          id="code"
          label={t('issuer.bonds.form.code')}
          error={errors.code?.message}
        >
          <Input
            id="code"
            className="h-10 font-mono uppercase"
            aria-invalid={!!errors.code}
            {...form.register('code')}
          />
        </FormField>

        <FormField
          id="name"
          label={t('issuer.bonds.form.name')}
          error={errors.name?.message}
        >
          <Input
            id="name"
            className="h-10"
            aria-invalid={!!errors.name}
            {...form.register('name')}
          />
        </FormField>
      </div>
    </FormSection>
  );
}
