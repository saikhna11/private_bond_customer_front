import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { PasswordInput } from '@/components/auth/password-input';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { FormField } from '@/components/common/form-field';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useCountdown } from '@/hooks/use-countdown';
import { useRelocalizedErrors } from '@/hooks/use-relocalized-errors';
import { type ApiError, toApiError } from '@/lib/fetcher';
import { formatSeconds } from '@/lib/format';
import { msg } from '@/lib/i18n';
import { issuerMeOptions } from '@/queries/issuer/options';
import { issuerLogin } from '@/queries/issuer/query';

/** A bond issuer's member signs in with the email an admin registered them under. */
const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, msg('issuer.emailRequired'))
    .pipe(z.email(msg('issuer.emailInvalid'))),
  password: z.string().min(1, msg('login.passwordRequired')),
});

type Values = z.infer<typeof schema>;

export function IssuerLoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<ApiError | null>(null);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const lockedFor = useCountdown(lockedUntil);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });
  const { errors, isSubmitting } = form.formState;
  useRelocalizedErrors(form);

  async function onSubmit(values: Values) {
    setError(null);
    try {
      await issuerLogin(values.email, values.password);
      await queryClient.fetchQuery(issuerMeOptions());
      await navigate({ to: '/issuer' });
    } catch (err) {
      const e = toApiError(err);
      if (e.retryAfter) setLockedUntil(Date.now() + e.retryAfter * 1000);
      form.resetField('password');
      setError(e);
    }
  }

  const locked = lockedFor > 0;
  const lockMessage =
    error && locked
      ? error.code === 'auth.account_locked'
        ? t('login.locked', { time: formatSeconds(lockedFor) })
        : t('login.throttled', { time: formatSeconds(lockedFor) })
      : undefined;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-5">
        <FormField
          id="email"
          label={t('common.email')}
          error={errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            placeholder="name@company.mn"
            className="h-12 rounded-xl"
            autoFocus
            aria-invalid={!!errors.email}
            {...form.register('email')}
          />
        </FormField>

        <FormField
          id="password"
          label={t('common.password')}
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-12 rounded-xl"
            aria-invalid={!!errors.password}
            {...form.register('password')}
          />
        </FormField>

        <ApiErrorAlert error={error} message={lockMessage} />

        <Button
          type="submit"
          size="lg"
          className="h-12 rounded-xl"
          disabled={isSubmitting || locked}
        >
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          {locked
            ? t('login.wait', { time: formatSeconds(lockedFor) })
            : t('common.login')}
        </Button>
      </FieldGroup>
    </form>
  );
}
