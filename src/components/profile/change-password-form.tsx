import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { PasswordChecklist } from '@/components/auth/password-checklist';
import { PasswordInput } from '@/components/auth/password-input';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { FormField } from '@/components/common/form-field';
import { Button } from '@/components/ui/button';
import { useCountdown } from '@/hooks/use-countdown';
import { useRelocalizedErrors } from '@/hooks/use-relocalized-errors';
import { type ApiError, toApiError } from '@/lib/fetcher';
import { formatSeconds } from '@/lib/format';
import i18n, { apiErrorMessage, msg } from '@/lib/i18n';
import { passwordSchema } from '@/lib/password';
import { showToast } from '@/lib/utils';
import { changePassword } from '@/queries/auth/query';

const schema = z
  .object({
    current: z.string().min(1, msg('changePassword.currentRequired')),
    password: passwordSchema,
    confirm: z.string().min(1, msg('password.confirmRequired')),
  })
  .refine((v) => v.password === v.confirm, {
    path: ['confirm'],
    ...msg('password.mismatch'),
  })
  .refine((v) => v.password !== v.current, {
    path: ['password'],
    ...msg('changePassword.sameAsCurrent'),
  });

type Values = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const { t } = useTranslation();
  const [error, setError] = useState<ApiError | null>(null);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const lockedFor = useCountdown(lockedUntil);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { current: '', password: '', confirm: '' },
  });
  const { errors, isSubmitting } = form.formState;
  useRelocalizedErrors(form);
  const [password, confirm] = useWatch({
    control: form.control,
    name: ['password', 'confirm'],
  });

  async function onSubmit(values: Values) {
    setError(null);
    try {
      await changePassword(values.current, values.password);
      form.reset();
      showToast('success', i18n.t('changePassword.success'));
    } catch (err) {
      const e = toApiError(err);
      if (e.code === 'user.wrong_password') {
        // resetField clears errors too: reset first, then mark the field.
        form.resetField('current');
        form.setError(
          'current',
          { message: apiErrorMessage(e) },
          { shouldFocus: true },
        );
        return;
      }
      if (e.retryAfter) setLockedUntil(Date.now() + e.retryAfter * 1000);
      setError(e);
    }
  }

  const locked = lockedFor > 0;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <FormField
        id="current_password"
        label={t('changePassword.current')}
        error={errors.current?.message}
      >
        <PasswordInput
          id="current_password"
          autoComplete="current-password"
          className="h-10"
          aria-invalid={!!errors.current}
          {...form.register('current')}
        />
      </FormField>
      <FormField
        id="new_password"
        label={t('common.newPassword')}
        error={errors.password?.message}
      >
        <PasswordInput
          id="new_password"
          autoComplete="new-password"
          className="h-10"
          aria-invalid={!!errors.password}
          {...form.register('password')}
        />
      </FormField>
      <FormField
        id="confirm_password"
        label={t('common.newPasswordConfirm')}
        error={errors.confirm?.message}
      >
        <PasswordInput
          id="confirm_password"
          autoComplete="new-password"
          className="h-10"
          aria-invalid={!!errors.confirm}
          {...form.register('confirm')}
        />
      </FormField>
      {password && <PasswordChecklist password={password} confirm={confirm} />}
      <ApiErrorAlert
        error={error}
        message={
          locked
            ? t('changePassword.locked', { time: formatSeconds(lockedFor) })
            : undefined
        }
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          className="h-10 px-5"
          disabled={isSubmitting || locked}
        >
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          {t('changePassword.submit')}
        </Button>
      </div>
    </form>
  );
}
