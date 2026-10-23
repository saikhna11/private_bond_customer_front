import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import {
  Building2Icon,
  ChevronRightIcon,
  GlobeIcon,
  Loader2Icon,
  UserRoundIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { AuthHeader } from '@/components/auth/auth-header';
import { PasswordChecklist } from '@/components/auth/password-checklist';
import { PasswordInput } from '@/components/auth/password-input';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { FormField } from '@/components/common/form-field';
import { PhoneInput } from '@/components/common/phone-input';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useRelocalizedErrors } from '@/hooks/use-relocalized-errors';
import { ORG_REGISTER } from '@/lib/client';
import { type ApiError, toApiError } from '@/lib/fetcher';
import { applyFieldErrors } from '@/lib/form-errors';
import { apiErrorMessage, msg } from '@/lib/i18n';
import { passwordSchema } from '@/lib/password';
import { isValidPhone } from '@/lib/phone';
import { cn } from '@/lib/utils';
import { signup, signupOrganization } from '@/queries/auth/query';
import { usePendingSignup } from '@/stores/pending-signup-store';

type Kind = 'customer' | 'foreign' | 'organization';

// Labels are `clientType.<value>`, hints `signup.hints.<value>`.
const kinds: { value: Kind; Icon: typeof GlobeIcon }[] = [
  { value: 'customer', Icon: UserRoundIcon },
  { value: 'foreign', Icon: GlobeIcon },
  { value: 'organization', Icon: Building2Icon },
];

// The password pair both steps end with.
const passwords = {
  password: passwordSchema,
  confirm: z.string().min(1, msg('password.confirmRequired')),
};

const samePassword = (v: { password: string; confirm: string }) =>
  v.password === v.confirm;
const mismatch = { path: ['confirm'], ...msg('password.mismatch') };

// The person signing up; for an organization, its representative.
const person = {
  last_name: z
    .string()
    .trim()
    .min(1, msg('validation.lastNameRequired'))
    .max(100, msg('validation.tooLong')),
  first_name: z
    .string()
    .trim()
    .min(1, msg('validation.firstNameRequired'))
    .max(100, msg('validation.tooLong')),
  email: z.email(msg('validation.emailInvalid')).max(254),
  phone: z.string().trim().refine(isValidPhone, msg('validation.phoneDigits')),
  ...passwords,
};

const schema = z.object(person).refine(samePassword, mismatch);

type Values = z.infer<typeof schema>;

const orgSchema = z
  .object({
    register_number: z
      .string()
      .trim()
      .regex(ORG_REGISTER, msg('login.orgRegisterInvalid')),
    ...person,
  })
  .refine(samePassword, mismatch);

type OrgValues = z.infer<typeof orgSchema>;

/**
 * Two short steps: pick who is signing up, then fill in the details. The
 * header lives here because its title and back link follow the step.
 */
export function SignupForm() {
  const { t } = useTranslation();
  const [kind, setKind] = useState<Kind | null>(null);
  const chosen = kinds.find((k) => k.value === kind);

  if (!chosen) {
    return (
      <>
        <StepLabel step={1} />
        <AuthHeader
          title={t('signup.title')}
          description={t('signup.description')}
        />
        <div className="flex flex-col gap-3" role="radiogroup">
          {kinds.map(({ value, Icon }) => (
            // biome-ignore lint/a11y/useSemanticElements: a card-styled radio
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={false}
              onClick={() => setKind(value)}
              className="group flex items-center gap-4 rounded-2xl border bg-card p-4 text-left transition-all outline-none hover:-translate-y-px hover:border-primary/50 hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-60 motion-reduce:hover:translate-y-0"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">
                  {t(`clientType.${value}`)}
                </span>
                <span className="block text-sm text-muted-foreground">
                  {t(`signup.hints.${value}`)}
                </span>
              </span>
              <ChevronRightIcon className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {t('signup.orgNote')}
        </p>
      </>
    );
  }

  return (
    <>
      <StepLabel step={2} />
      <AuthHeader
        title={t('signup.detailsTitle')}
        back={{ onClick: () => setKind(null), label: t('signup.changeType') }}
        description={
          <span className="inline-flex items-center gap-1.5">
            <chosen.Icon className="size-4 text-primary" />
            {t(`clientType.${chosen.value}`)}
          </span>
        }
      />
      {chosen.value === 'organization' ? (
        <OrganizationFields />
      ) : (
        <PersonFields kind={chosen.value} />
      )}
    </>
  );
}

function StepLabel({ step }: { step: 1 | 2 }) {
  const { t } = useTranslation();
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2].map((s) => (
          <span
            key={s}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              s === step ? 'w-8 bg-primary' : 'w-4 bg-border',
              s < step && 'bg-primary/40',
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        {t('signup.step', { step })}
      </span>
    </div>
  );
}

function PersonFields({ kind }: { kind: 'customer' | 'foreign' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const startSignup = usePendingSignup((s) => s.start);
  const [error, setError] = useState<ApiError | null>(null);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      last_name: '',
      first_name: '',
      email: '',
      phone: '',
      password: '',
      confirm: '',
    },
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
      const sent = await signup({
        type: kind,
        last_name: values.last_name,
        first_name: values.first_name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      startSignup(values.email, { ...sent, sent_at: Date.now() });
      await navigate({ to: '/verify' });
    } catch (err) {
      const e = toApiError(err);
      if (e.code === 'user.email_taken') {
        form.setError('email', { message: apiErrorMessage(e) });
        return;
      }
      if (e.code === 'user.phone_taken') {
        form.setError('phone', { message: apiErrorMessage(e) });
        return;
      }
      if (
        applyFieldErrors(e, form.setError, {
          last_name: 'last_name',
          first_name: 'first_name',
          email: 'email',
          phone: 'phone',
          password: 'password',
        })
      ) {
        return;
      }
      setError(e);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            id="last_name"
            label={t('common.lastName')}
            error={errors.last_name?.message}
          >
            <Input
              id="last_name"
              autoComplete="family-name"
              className="h-12 rounded-xl"
              aria-invalid={!!errors.last_name}
              {...form.register('last_name')}
            />
          </FormField>
          <FormField
            id="first_name"
            label={t('common.firstName')}
            error={errors.first_name?.message}
          >
            <Input
              id="first_name"
              autoComplete="given-name"
              className="h-12 rounded-xl"
              aria-invalid={!!errors.first_name}
              {...form.register('first_name')}
            />
          </FormField>
        </div>

        <FormField
          id="email"
          label={t('common.email')}
          error={errors.email?.message}
          hint={
            kind === 'foreign'
              ? t('signup.emailHintForeign')
              : t('signup.emailHintCustomer')
          }
        >
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            className="h-12 rounded-xl"
            aria-invalid={!!errors.email}
            {...form.register('email')}
          />
        </FormField>

        <FormField
          id="phone"
          label={t('common.phoneNumber')}
          error={errors.phone?.message}
          hint={kind === 'customer' ? t('signup.phoneHint') : undefined}
        >
          <Controller
            control={form.control}
            name="phone"
            render={({ field }) => (
              <PhoneInput
                id="phone"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                invalid={!!errors.phone}
                large
              />
            )}
          />
        </FormField>

        <FormField
          id="password"
          label={t('common.password')}
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            className="h-12 rounded-xl"
            aria-invalid={!!errors.password}
            {...form.register('password')}
          />
        </FormField>

        <FormField
          id="confirm"
          label={t('common.passwordConfirm')}
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

        <Button
          type="submit"
          size="lg"
          className="h-12 rounded-xl"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          {t('common.signup')}
        </Button>
      </FieldGroup>
    </form>
  );
}

/**
 * The organization's register number and the person signing up for it, who becomes its
 * first officer. The code goes to their phone by SMS; the register number is the login
 * from then on. The organization's name and the rest come after sign-in.
 */
function OrganizationFields() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const startSignup = usePendingSignup((s) => s.start);
  const [error, setError] = useState<ApiError | null>(null);

  const form = useForm<OrgValues>({
    resolver: zodResolver(orgSchema),
    mode: 'onTouched',
    defaultValues: {
      register_number: '',
      last_name: '',
      first_name: '',
      email: '',
      phone: '',
      password: '',
      confirm: '',
    },
  });
  const { errors, isSubmitting } = form.formState;
  useRelocalizedErrors(form);
  const [password, confirm] = useWatch({
    control: form.control,
    name: ['password', 'confirm'],
  });

  async function onSubmit(values: OrgValues) {
    setError(null);
    try {
      const sent = await signupOrganization({
        register_number: values.register_number,
        last_name: values.last_name,
        first_name: values.first_name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      startSignup(values.register_number, { ...sent, sent_at: Date.now() });
      await navigate({ to: '/verify' });
    } catch (err) {
      const e = toApiError(err);
      const taken = orgTakenField[e.code];
      if (taken) {
        form.setError(taken, { message: apiErrorMessage(e) });
        return;
      }
      if (
        applyFieldErrors(e, form.setError, {
          register_number: 'register_number',
          last_name: 'last_name',
          first_name: 'first_name',
          email: 'email',
          phone: 'phone',
          password: 'password',
        })
      ) {
        return;
      }
      setError(e);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-5">
        <FormField
          id="register_number"
          label={t('signup.org.registerNumber')}
          error={errors.register_number?.message}
          hint={t('signup.org.registerHint')}
        >
          <Input
            id="register_number"
            inputMode="numeric"
            autoComplete="username"
            placeholder="1234567"
            maxLength={7}
            className="tabular h-12 rounded-xl tracking-widest"
            aria-invalid={!!errors.register_number}
            {...form.register('register_number', {
              setValueAs: (v: string) => v.replace(/\D/g, ''),
            })}
          />
        </FormField>

        <div className="space-y-1 border-t pt-5">
          <p className="text-sm font-semibold">
            {t('signup.org.representative')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('signup.org.representativeText')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            id="last_name"
            label={t('common.lastName')}
            error={errors.last_name?.message}
          >
            <Input
              id="last_name"
              autoComplete="family-name"
              className="h-12 rounded-xl"
              aria-invalid={!!errors.last_name}
              {...form.register('last_name')}
            />
          </FormField>
          <FormField
            id="first_name"
            label={t('common.firstName')}
            error={errors.first_name?.message}
          >
            <Input
              id="first_name"
              autoComplete="given-name"
              className="h-12 rounded-xl"
              aria-invalid={!!errors.first_name}
              {...form.register('first_name')}
            />
          </FormField>
        </div>

        <FormField
          id="phone"
          label={t('common.phoneNumber')}
          error={errors.phone?.message}
          hint={t('signup.phoneHint')}
        >
          <Controller
            control={form.control}
            name="phone"
            render={({ field }) => (
              <PhoneInput
                id="phone"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                invalid={!!errors.phone}
                large
              />
            )}
          />
        </FormField>
        <FormField
          id="email"
          label={t('common.email')}
          error={errors.email?.message}
          hint={t('signup.org.emailHint')}
        >
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            className="h-12 rounded-xl"
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
            autoComplete="new-password"
            className="h-12 rounded-xl"
            aria-invalid={!!errors.password}
            {...form.register('password')}
          />
        </FormField>

        <FormField
          id="confirm"
          label={t('common.passwordConfirm')}
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

        <Button
          type="submit"
          size="lg"
          className="h-12 rounded-xl"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          {t('common.signup')}
        </Button>
      </FieldGroup>
    </form>
  );
}

const orgTakenField: Partial<Record<string, keyof OrgValues>> = {
  'client.register_taken': 'register_number',
  'user.email_taken': 'email',
  'user.phone_taken': 'phone',
};
