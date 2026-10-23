import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { Building2Icon, Loader2Icon, UserRoundIcon } from 'lucide-react';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCountdown } from '@/hooks/use-countdown';
import { useRelocalizedErrors } from '@/hooks/use-relocalized-errors';
import { ORG_REGISTER } from '@/lib/client';
import { type ApiError, toApiError } from '@/lib/fetcher';
import { formatSeconds } from '@/lib/format';
import { msg } from '@/lib/i18n';
import { isValidPhone } from '@/lib/phone';
import { meOptions } from '@/queries/auth/options';
import { login, resendCode } from '@/queries/auth/query';
import { usePendingSignup } from '@/stores/pending-signup-store';

type Kind = 'person' | 'organization';

const personSchema = z.object({
  login: z
    .string()
    .trim()
    .min(1, msg('login.loginRequired'))
    .refine(
      (v) => z.email().safeParse(v).success || isValidPhone(v),
      msg('login.loginInvalid'),
    ),
  password: z.string().min(1, msg('login.passwordRequired')),
});

const orgSchema = z.object({
  login: z.string().trim().regex(ORG_REGISTER, msg('login.orgRegisterInvalid')),
  password: z.string().min(1, msg('login.passwordRequired')),
});

type Values = z.infer<typeof personSchema>;

export function LoginForm() {
  const { t } = useTranslation();
  const [kind, setKind] = useState<Kind>('person');

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={kind} onValueChange={(v) => setKind(v as Kind)}>
        <TabsList className="grid h-12! w-full grid-cols-2 rounded-xl p-1">
          <TabsTrigger value="person" className="h-full rounded-lg">
            <UserRoundIcon />
            {t('login.person')}
          </TabsTrigger>
          <TabsTrigger value="organization" className="h-full rounded-lg">
            <Building2Icon />
            {t('login.organization')}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Keyed so switching tabs starts a clean form. */}
      <LoginFields key={kind} kind={kind} />
    </div>
  );
}

function LoginFields({ kind }: { kind: Kind }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const startSignup = usePendingSignup((s) => s.start);
  const [error, setError] = useState<ApiError | null>(null);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const lockedFor = useCountdown(lockedUntil);

  const form = useForm<Values>({
    resolver: zodResolver(kind === 'person' ? personSchema : orgSchema),
    defaultValues: { login: '', password: '' },
  });
  const { errors, isSubmitting } = form.formState;
  useRelocalizedErrors(form);

  async function onSubmit(values: Values) {
    setError(null);
    try {
      await login(values.login, values.password);
      await queryClient.fetchQuery(meOptions());
      await navigate({ to: '/' });
    } catch (err) {
      const e = toApiError(err);
      if (e.code === 'auth.not_verified') {
        // Right password, code never entered: send a fresh code and ask for it.
        try {
          const sent = await resendCode(values.login);
          startSignup(values.login, { ...sent, sent_at: Date.now() });
          await navigate({ to: '/verify' });
          return;
        } catch (resendErr) {
          setError(toApiError(resendErr));
          return;
        }
      }
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
        {kind === 'person' ? (
          <FormField
            id="login"
            label={t('login.loginLabel')}
            error={errors.login?.message}
          >
            <Input
              id="login"
              type="text"
              inputMode="email"
              autoComplete="username"
              placeholder={t('login.loginPlaceholder')}
              className="h-12 rounded-xl"
              autoFocus
              aria-invalid={!!errors.login}
              {...form.register('login')}
            />
          </FormField>
        ) : (
          <FormField
            id="login"
            label={t('login.orgLabel')}
            error={errors.login?.message}
          >
            <Input
              id="login"
              inputMode="numeric"
              autoComplete="username"
              placeholder="1234567"
              maxLength={7}
              className="tabular h-12 rounded-xl tracking-widest"
              autoFocus
              aria-invalid={!!errors.login}
              {...form.register('login')}
            />
          </FormField>
        )}

        <FormField
          id="password"
          label={t('common.password')}
          error={errors.password?.message}
          action={
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t('login.forgot')}
            </Link>
          }
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
