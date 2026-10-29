import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon, Loader2Icon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { FormField } from '@/components/common/form-field';
import { PhoneInput } from '@/components/common/phone-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PERSON_REGISTER } from '@/lib/client';
import { msg } from '@/lib/i18n';
import { isValidPhone } from '@/lib/phone';
import type { CoHolder, Product } from '@/queries/contract/type';
import { useCoHolderCheck } from './use-co-holder-check';

const CYRILLIC = /[А-ЯЁӨҮ]/i;

// A number with Cyrillic letters is a register number and must look like one; any other is
// a passport number, which the profile takes as typed.
const schema = z.object({
  register_no: z
    .string()
    .trim()
    .min(1, msg('contract.coHolder.registerNoRequired'))
    .max(30, msg('validation.tooLong'))
    .refine(
      (v) => !CYRILLIC.test(v) || PERSON_REGISTER.test(v.toUpperCase()),
      msg('details.errors.register'),
    ),
  phone: z.string().refine(isValidPhone, msg('validation.phoneDigits')),
});

type Values = z.infer<typeof schema>;

/**
 * Names the co-holder of a product's contract: another approved client, by the register
 * number (a foreigner's passport number) and phone they signed up with, both. The preview
 * is fetched here, so a co-holder who is not found stays on this form. They sign later,
 * from their own account.
 */
export function CoHolderStep({
  product,
  initial,
  onDone,
  onBack,
}: {
  product: Product;
  initial: CoHolder | null;
  onDone: (coHolder: CoHolder) => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? { register_no: '', phone: '' },
  });
  const { errors, isSubmitting } = form.formState;
  const { error, check } = useCoHolderCheck(product, (message) =>
    form.setError('register_no', { message }),
  );

  async function onSubmit(values: Values) {
    const coHolder = {
      register_no: values.register_no.toUpperCase(),
      phone: values.phone,
    };
    if (await check(coHolder)) {
      onDone(coHolder);
    }
  }

  return (
    <Card>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <p className="text-sm text-muted-foreground">
            {t('contract.coHolder.intro')}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="co_register_no"
              label={t('contract.coHolder.registerNo')}
              error={errors.register_no?.message}
            >
              <Input
                id="co_register_no"
                placeholder={t('contract.coHolder.registerNoPlaceholder')}
                className="h-10 uppercase"
                autoComplete="off"
                autoFocus
                aria-invalid={!!errors.register_no}
                {...form.register('register_no')}
              />
            </FormField>
            <FormField
              id="co_phone"
              label={t('contract.coHolder.phone')}
              error={errors.phone?.message}
            >
              <Controller
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <PhoneInput
                    id="co_phone"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    invalid={!!errors.phone}
                  />
                )}
              />
            </FormField>
          </div>
          <ApiErrorAlert error={error} />
          <div className="flex justify-between">
            <Button
              className="h-10 rounded-xl"
              type="button"
              variant="outline"
              onClick={onBack}
            >
              {t('contract.back')}
            </Button>
            <Button
              type="submit"
              className="h-10 rounded-xl px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <ArrowRightIcon />
              )}
              {t('contract.coHolder.submit')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
