import { useTranslation } from 'react-i18next';
import { FormField } from '@/components/common/form-field';
import { PhoneInput } from '@/components/common/phone-input';
import { Input } from '@/components/ui/input';
import type { PurchaseForm } from './use-purchase-form';

/**
 * The co-holder of a joint contract: another approved client, by the register number (a
 * foreigner's passport number) and phone they signed up with. They sign later, from their
 * own account.
 */
export function CoHolderFields({ form }: { form: PurchaseForm }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3 rounded-xl border border-dashed p-4">
      <p className="text-sm text-muted-foreground">
        {t('contract.coHolder.intro')}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="co_register_no"
          label={t('contract.coHolder.registerNo')}
          error={form.registerNo ? form.errors.registerNo : undefined}
        >
          <Input
            id="co_register_no"
            placeholder={t('contract.coHolder.registerNoPlaceholder')}
            className="h-10 uppercase"
            autoComplete="off"
            value={form.registerNo}
            aria-invalid={!!form.registerNo && !!form.errors.registerNo}
            onChange={(e) => form.setRegisterNo(e.target.value)}
          />
        </FormField>
        <FormField
          id="co_phone"
          label={t('contract.coHolder.phone')}
          error={form.phone ? form.errors.phone : undefined}
        >
          <PhoneInput
            id="co_phone"
            value={form.phone}
            onChange={form.setPhone}
            invalid={!!form.phone && !!form.errors.phone}
          />
        </FormField>
      </div>
    </div>
  );
}
