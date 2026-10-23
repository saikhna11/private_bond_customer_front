import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { CircleCheckIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { AuthHeader } from '@/components/auth/auth-header';
import {
  OtpCodeForm,
  type SentCode,
  sentNow,
} from '@/components/auth/otp-code-form';
import { PasswordChecklist } from '@/components/auth/password-checklist';
import { PasswordInput } from '@/components/auth/password-input';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { FormField } from '@/components/common/form-field';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useRelocalizedErrors } from '@/hooks/use-relocalized-errors';
import { type ApiError, toApiError } from '@/lib/fetcher';
import { msg } from '@/lib/i18n';
import { passwordSchema } from '@/lib/password';
import { cn } from '@/lib/utils';
import {
  forgotPassword,
  resetPassword,
  verifyReset,
} from '@/queries/auth/query';

type Step =
  | { name: 'login' }
  | { name: 'code'; login: string; sent: SentCode }
  | { name: 'password'; login: string; resetToken: string }
  | { name: 'done' };

const steps = ['login', 'code', 'password'] as const;

export function ForgotPasswordFlow() {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>({ name: 'login' });
  const index = { login: 0, code: 1, password: 2, done: 3 }[step.name];

  if (step.name === 'done') {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="mb-5 flex size-14 items-center justify-center rounded-full bg-success/12 text-success">
          <CircleCheckIcon className="size-7" />
        </span>
        <h2 className="text-2xl font-semibold tracking-tight">
          {t('forgot.doneTitle')}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('forgot.doneText')}
        </p>
        <Button asChild size="lg" className="mt-8 h-12 w-full rounded-xl">
          <Link to="/login">{t('common.login')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <AuthHeader
        title={t('forgot.title')}
        description={
          step.name === 'login'
            ? t('forgot.descLogin')
            : step.name === 'code'
              ? t('forgot.descCode')
              : t('forgot.descPassword')
        }
        back={
          step.name === 'login'
            ? { to: '/login', label: t('forgot.backToLogin') }
            : {
                onClick: () => setStep({ name: 'login' }),
                label: t('forgot.restart'),
              }
        }
      />
      <ol
        className="mb-8 grid grid-cols-3 gap-2"
        aria-label={t('forgot.stepsLabel')}
      >
        {steps.map((name, i) => (
          <li key={name} className="space-y-1.5">
            <span
              className={cn(
                'block h-1 rounded-full bg-border transition-colors',
                i <= index && 'bg-primary',
              )}
            />
            <span
              className={cn(
                'block text-xs',
                i === index
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground',
              )}
              aria-current={i === index ? 'step' : undefined}
            >
              {i + 1}. {t(`forgot.steps.${name}`)}
            </span>
          </li>
        ))}
      </ol>

      {step.name === 'login' && (
        <LoginStep
          onSent={(login) => setStep({ name: 'code', login, sent: sentNow() })}
        />
      )}
      {step.name === 'code' && (
        <OtpCodeForm
          sent={step.sent}
          submitLabel={t('forgot.continue')}
          onVerify={async (code) => {
            const res = await verifyReset(step.login, code);
            setStep({
              name: 'password',
              login: step.login,
              resetToken: res.reset_token,
            });
          }}
          onResend={async () => {
            await forgotPassword(step.login);
            return undefined;
          }}
        />
      )}
      {step.name === 'password' && (
        <PasswordStep
          resetToken={step.resetToken}
          onDone={() => setStep({ name: 'done' })}
          onRestart={() => setStep({ name: 'login' })}
        />
      )}
    </>
  );
}

const loginSchema = z.object({
  login: z
    .string()
    .trim()
    .min(1, msg('forgot.loginRequired'))
    .refine(
      (v) => z.email().safeParse(v).success || /^\d{7,8}$/.test(v),
      msg('forgot.loginInvalid'),
    ),
});

function LoginStep({ onSent }: { onSent: (login: string) => void }) {
  const { t } = useTranslation();
  const [error, setError] = useState<ApiError | null>(null);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: '' },
  });
  const { errors, isSubmitting } = form.formState;
  useRelocalizedErrors(form);

  async function onSubmit({ login }: z.infer<typeof loginSchema>) {
    setError(null);
    try {
      // 204 whether or not the login exists: never say "not found".
      await forgotPassword(login);
      onSent(login);
    } catch (err) {
      setError(toApiError(err));
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-5">
        <FormField
          id="login"
          label={t('forgot.loginLabel')}
          error={errors.login?.message}
        >
          <Input
            id="login"
            autoComplete="username"
            placeholder="name@example.com"
            className="h-12 rounded-xl"
            autoFocus
            aria-invalid={!!errors.login}
            {...form.register('login')}
          />
        </FormField>
        <ApiErrorAlert error={error} />
        <Button
          type="submit"
          size="lg"
          className="h-12 rounded-xl"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          {t('forgot.getCode')}
        </Button>
      </FieldGroup>
    </form>
  );
}

const passwordStepSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string().min(1, msg('password.confirmRequired')),
  })
  .refine((v) => v.password === v.confirm, {
    path: ['confirm'],
    ...msg('password.mismatch'),
  });

function PasswordStep({
  resetToken,
  onDone,
  onRestart,
}: {
  resetToken: string;
  onDone: () => void;
  onRestart: () => void;
}) {
  const { t } = useTranslation();
  const [error, setError] = useState<ApiError | null>(null);
  const form = useForm<z.infer<typeof passwordStepSchema>>({
    resolver: zodResolver(passwordStepSchema),
    mode: 'onTouched',
    defaultValues: { password: '', confirm: '' },
  });
  const { errors, isSubmitting } = form.formState;
  useRelocalizedErrors(form);
  const [password, confirm] = useWatch({
    control: form.control,
    name: ['password', 'confirm'],
  });

  async function onSubmit(values: z.infer<typeof passwordStepSchema>) {
    setError(null);
    try {
      await resetPassword(resetToken, values.password);
      onDone();
    } catch (err) {
      setError(toApiError(err));
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-5">
        <FormField
          id="password"
          label={t('common.newPassword')}
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            className="h-12 rounded-xl"
            autoFocus
            aria-invalid={!!errors.password}
            {...form.register('password')}
          />
        </FormField>
        <FormField
          id="confirm"
          label={t('common.newPasswordConfirm')}
          error={errors.confirm?.message}
        >
          <PasswordInput
            id="confirm"
            autoComplete="new-password"
            className="h-12 rounded-xl"
            aria-invalid={!!errors.confirm}
            {...form.register('confirm')}
          />
        </FormField>
        <PasswordChecklist password={password} confirm={confirm} />
        <ApiErrorAlert error={error} />
        {error?.code === 'auth.reset_invalid' ? (
          <Button
            type="button"
            size="lg"
            className="h-12 rounded-xl"
            onClick={onRestart}
          >
            {t('forgot.getCodeAgain')}
          </Button>
        ) : (
          <Button
            type="submit"
            size="lg"
            className="h-12 rounded-xl"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {t('forgot.submit')}
          </Button>
        )}
        <p className="text-center text-xs text-muted-foreground">
          {t('forgot.within')}
        </p>
      </FieldGroup>
    </form>
  );
}
