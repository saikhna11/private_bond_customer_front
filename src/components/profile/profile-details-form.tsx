import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import type { ParseKeys } from 'i18next';
import { Loader2Icon, LockIcon, PercentIcon } from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { FormField } from '@/components/common/form-field';
import { PhoneInput } from '@/components/common/phone-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useRelocalizedErrors } from '@/hooks/use-relocalized-errors';
import { banks } from '@/lib/banks';
import { PERSON_REGISTER } from '@/lib/client';
import { countries, priorityCount } from '@/lib/countries';
import { type ApiError, toApiError } from '@/lib/fetcher';
import { applyFieldErrors } from '@/lib/form-errors';
import i18n, { apiErrorMessage, currentLanguage, msg } from '@/lib/i18n';
import { isValidPhone } from '@/lib/phone';
import { cn, showToast } from '@/lib/utils';
import { authKeys } from '@/queries/auth/options';
import { updateMe } from '@/queries/auth/query';
import type {
  MeType,
  TaxExemptStatus,
  UpdateMeBody,
} from '@/queries/auth/type';

const text = (max: number) =>
  z.string().trim().max(max, msg('validation.tooLong'));

// Every field of every type; superRefine checks the ones of the client's type.
const schema = z.object({
  last_name: text(100),
  first_name: text(100),
  register_number: z.string().trim(),
  nationality: z.string(),
  passport_number: text(30),
  phone_secondary: z.string().trim(),
  address: text(500),
  bank_name: text(100),
  account_number: z.string().trim(),
  iban: z.string().trim(),
  holder_last_name: text(100),
  holder_first_name: text(100),
  tax_exempt: z.boolean(),
  name: text(200),
  activity: text(200),
});

type Values = z.infer<typeof schema>;
type Key = keyof Values;

function initial(me: MeType): Values {
  const bank = me.bank_account;
  return {
    last_name: me.last_name ?? '',
    first_name: me.first_name ?? '',
    register_number: me.register_number ?? '',
    nationality: me.nationality ?? '',
    passport_number: me.passport_number ?? '',
    phone_secondary: me.phone_secondary ?? '',
    address: me.address ?? '',
    bank_name: bank?.bank_name ?? '',
    account_number: bank?.account_number ?? '',
    // The form keeps the 18 digits; MN is fixed in front of them.
    iban: bank?.iban.replace(/^mn/i, '') ?? '',
    holder_last_name: bank?.holder_last_name ?? me.last_name ?? '',
    holder_first_name: bank?.holder_first_name ?? me.first_name ?? '',
    tax_exempt:
      me.tax_exempt_status === 'requested' ||
      me.tax_exempt_status === 'approved',
    name: me.name ?? '',
    activity: me.activity ?? '',
  };
}

function rules(me: MeType) {
  const customer = me.type === 'customer';
  const foreign = me.type === 'foreign';
  const organization = me.type === 'organization';

  return schema.superRefine((v, ctx) => {
    const need = (ok: boolean, path: Key, key: ParseKeys) => {
      if (!ok)
        ctx.addIssue({ code: 'custom', path: [path], message: i18n.t(key) });
    };
    if (customer || foreign) {
      need(v.last_name !== '', 'last_name', 'validation.lastNameRequired');
      need(v.first_name !== '', 'first_name', 'validation.firstNameRequired');
      need(
        v.phone_secondary === '' || isValidPhone(v.phone_secondary),
        'phone_secondary',
        'validation.phoneDigits',
      );
    }
    if (customer) {
      need(
        PERSON_REGISTER.test(v.register_number.toUpperCase()),
        'register_number',
        'details.errors.register',
      );
      need(v.bank_name !== '', 'bank_name', 'details.errors.bank');
      need(
        /^\d{6,20}$/.test(v.account_number),
        'account_number',
        'details.errors.accountNumber',
      );
      need(/^\d{18}$/.test(v.iban), 'iban', 'details.errors.iban');
      need(
        v.holder_last_name !== '',
        'holder_last_name',
        'details.errors.holderLastName',
      );
      need(
        v.holder_first_name !== '',
        'holder_first_name',
        'details.errors.holderFirstName',
      );
    }
    if (foreign) {
      need(
        /^[A-Z]{2}$/.test(v.nationality) && v.nationality !== 'MN',
        'nationality',
        'details.errors.nationality',
      );
      need(
        v.passport_number !== '',
        'passport_number',
        'details.errors.passport',
      );
    }
    if (organization) {
      need(v.name !== '', 'name', 'validation.orgNameRequired');
      need(v.activity !== '', 'activity', 'details.errors.activity');
      need(v.address !== '', 'address', 'details.errors.address');
    }
  });
}

/** The PATCH /me body: only what changed, and only fields the client may still change. */
function changes(me: MeType, values: Values): UpdateMeBody {
  const before = initial(me);
  const locked = me.status === 'approved';
  const body: UpdateMeBody = {};
  const keys: Key[] = [];

  if (me.type === 'customer' || me.type === 'foreign') {
    keys.push('phone_secondary', 'address');
    if (!locked) keys.push('last_name', 'first_name');
    if (!locked && me.type === 'customer') keys.push('register_number');
    if (!locked && me.type === 'foreign')
      keys.push('nationality', 'passport_number');
  }
  // An organization's officers have their own card (OfficersCard).
  if (me.type === 'organization') {
    keys.push('activity', 'address');
    if (!locked) keys.push('name');
  }

  for (const k of keys) {
    const raw = values[k] as string;
    const v = k === 'register_number' ? raw.toUpperCase() : raw;
    // An empty optional field cannot be cleared through PATCH: leave it as it is.
    if (v !== before[k] && v !== '') (body as Record<string, string>)[k] = v;
  }

  if (me.type === 'customer') {
    const bankKeys = [
      'bank_name',
      'account_number',
      'iban',
      'holder_last_name',
      'holder_first_name',
    ] as const;
    // The account is replaced as a whole: send it when any part changed, or when the
    // client has none yet.
    if (!me.bank_account || bankKeys.some((k) => values[k] !== before[k])) {
      body.bank_account = {
        bank_name: values.bank_name,
        account_number: values.account_number,
        iban: `MN${values.iban}`,
        holder_last_name: values.holder_last_name,
        holder_first_name: values.holder_first_name,
      };
    }
    if (values.tax_exempt !== before.tax_exempt)
      body.tax_exempt = values.tax_exempt;
  }
  return body;
}

const fieldOf: Partial<Record<string, Key>> = {
  'client.register_taken': 'register_number',
  'client.passport_taken': 'passport_number',
  'client.org_name_taken': 'name',
};

/**
 * PATCH /me: completes the profile, or changes it later, for a customer, a foreigner or
 * an organization. Reviewed fields lock once approved; contacts, the bank account and
 * the tax exemption stay editable. Sends only what changed.
 */
export function ProfileDetailsForm({
  me,
  submitLabel,
  onSaved,
}: {
  me: MeType;
  submitLabel?: string;
  onSaved?: (me: MeType) => void;
}) {
  const { t } = useTranslation();
  const lang = currentLanguage();
  const countryList = useMemo(() => countries(lang), [lang]);
  const queryClient = useQueryClient();
  const [error, setError] = useState<ApiError | null>(null);
  const locked = me.status === 'approved';
  const customer = me.type === 'customer';
  const organization = me.type === 'organization';

  const form = useForm<Values>({
    resolver: zodResolver(rules(me)),
    mode: 'onTouched',
    defaultValues: initial(me),
  });
  const { errors, isSubmitting, isDirty } = form.formState;
  useRelocalizedErrors(form);

  async function onSubmit(values: Values) {
    setError(null);
    const body = changes(me, values);
    if (Object.keys(body).length === 0) {
      showToast('info', t('details.nothingToChange'));
      return;
    }
    try {
      const next = await updateMe(body);
      queryClient.setQueryData(authKeys.me(), next);
      form.reset(initial(next));
      if (me.status === 'rejected' && next.status === 'pending') {
        showToast('success', t('details.resubmitted'));
      } else if (body.tax_exempt === true) {
        showToast('success', t('details.taxRequested'));
      } else {
        showToast('success', t('details.saved'));
      }
      onSaved?.(next);
    } catch (err) {
      const e = toApiError(err);
      const name = fieldOf[e.code];
      if (name) {
        form.setError(name, { message: apiErrorMessage(e) });
        return;
      }
      const bankFields = {
        'bank_account.bank_name': 'bank_name',
        'bank_account.account_number': 'account_number',
        'bank_account.iban': 'iban',
        'bank_account.holder_last_name': 'holder_last_name',
        'bank_account.holder_first_name': 'holder_first_name',
      } as const;
      const fields = Object.fromEntries(
        (Object.keys(schema.shape) as Key[]).map((k) => [k, k]),
      ) as Record<string, Key>;
      if (applyFieldErrors(e, form.setError, { ...fields, ...bankFields }))
        return;
      setError(e);
    }
  }

  const lockHint = locked ? (
    <span className="inline-flex items-center gap-1">
      <LockIcon className="size-3" />
      {t('details.lockHint')}
    </span>
  ) : undefined;

  const input = (
    name: Key,
    label: string,
    props: React.ComponentProps<typeof Input> & {
      optional?: boolean;
      lock?: boolean;
      hint?: React.ReactNode;
      upper?: boolean;
    } = {},
  ) => {
    const { optional, lock, hint, upper, className, ...rest } = props;
    return (
      <FormField
        id={name}
        label={label}
        optional={optional}
        error={errors[name]?.message}
        hint={(lock && lockHint) || hint}
      >
        <Input
          id={name}
          className={cn('h-10', upper && 'uppercase', className)}
          disabled={lock && locked}
          aria-invalid={!!errors[name]}
          {...rest}
          {...form.register(
            name,
            upper ? { setValueAs: (v: string) => v.toUpperCase() } : undefined,
          )}
        />
      </FormField>
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-8">
        {organization ? (
          <Section title={t('details.orgInfo')}>
            <div className="sm:col-span-2">
              {input('name', t('details.orgName'), {
                lock: true,
                autoComplete: 'organization',
                maxLength: 200,
                placeholder: t('details.orgNamePlaceholder'),
              })}
            </div>
            <div className="sm:col-span-2">
              <FormField
                id="activity"
                label={t('details.activity')}
                error={errors.activity?.message}
              >
                <Textarea
                  id="activity"
                  rows={2}
                  maxLength={200}
                  placeholder={t('details.activityPlaceholder')}
                  aria-invalid={!!errors.activity}
                  {...form.register('activity')}
                />
              </FormField>
            </div>
            <div className="sm:col-span-2">
              {input('address', t('details.address'), {
                autoComplete: 'street-address',
                placeholder: t('details.orgAddressPlaceholder'),
              })}
            </div>
          </Section>
        ) : (
          <>
            <Section title={t('details.personal')}>
              {input('last_name', t('common.lastName'), {
                lock: true,
                autoComplete: 'family-name',
              })}
              {input('first_name', t('common.firstName'), {
                lock: true,
                autoComplete: 'given-name',
              })}
              {customer ? (
                input('register_number', t('common.registerNumber'), {
                  lock: true,
                  upper: true,
                  placeholder: 'УБ12345678',
                  maxLength: 10,
                  className: 'tabular tracking-wider',
                  hint: t('details.registerHint'),
                })
              ) : (
                <>
                  <FormField
                    id="nationality"
                    label={t('details.nationality')}
                    error={errors.nationality?.message}
                    hint={lockHint}
                  >
                    <Controller
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <Select
                          value={field.value || undefined}
                          onValueChange={field.onChange}
                          disabled={locked}
                        >
                          <SelectTrigger
                            id="nationality"
                            className="h-10! w-full"
                            aria-invalid={!!errors.nationality}
                            onBlur={field.onBlur}
                          >
                            <SelectValue placeholder={t('details.select')} />
                          </SelectTrigger>
                          <SelectContent className="max-h-72">
                            {countryList.map((c, i) => (
                              <Fragment key={c.code}>
                                {i === priorityCount && <SelectSeparator />}
                                <SelectItem value={c.code}>
                                  <span className="w-6 font-mono text-xs text-muted-foreground">
                                    {c.code}
                                  </span>
                                  {c.name}
                                </SelectItem>
                              </Fragment>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                  {input('passport_number', t('details.passportNumber'), {
                    lock: true,
                    upper: true,
                    maxLength: 30,
                    className: 'tabular',
                  })}
                </>
              )}
            </Section>

            <Section title={t('details.contact')}>
              <FormField
                id="phone_secondary"
                label={t('details.phoneSecondary')}
                optional
                error={errors.phone_secondary?.message}
              >
                <Controller
                  control={form.control}
                  name="phone_secondary"
                  render={({ field }) => (
                    <PhoneInput
                      id="phone_secondary"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      invalid={!!errors.phone_secondary}
                    />
                  )}
                />
              </FormField>
              <div className="sm:col-span-2">
                {input('address', t('details.homeAddress'), {
                  optional: true,
                  autoComplete: 'street-address',
                  placeholder: t('details.homeAddressPlaceholder'),
                })}
              </div>
            </Section>
          </>
        )}

        {customer && (
          <>
            <Section
              title={t('details.bankAccount')}
              description={t('details.bankAccountText')}
            >
              <FormField
                id="bank_name"
                label={t('details.bank')}
                error={errors.bank_name?.message}
              >
                <Controller
                  control={form.control}
                  name="bank_name"
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="bank_name"
                        className="h-10! w-full"
                        aria-invalid={!!errors.bank_name}
                        onBlur={field.onBlur}
                      >
                        <SelectValue placeholder={t('details.selectBank')} />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {/* A bank saved earlier under another name stays selectable. */}
                        {banks.map((b) => (
                          <SelectItem key={b.value} value={b.value}>
                            {t(`banks.${b.key}`)}
                          </SelectItem>
                        ))}
                        {field.value &&
                          !banks.some((b) => b.value === field.value) && (
                            <SelectItem value={field.value}>
                              {field.value}
                            </SelectItem>
                          )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              {input('account_number', t('details.accountNumber'), {
                inputMode: 'numeric',
                maxLength: 20,
                placeholder: '5000123456',
                className: 'tabular',
              })}
              <div className="sm:col-span-2">
                <FormField
                  id="iban"
                  label={t('details.iban')}
                  error={errors.iban?.message}
                  hint={t('details.ibanHint')}
                >
                  <div className="flex">
                    <span className="inline-flex h-10 items-center rounded-l-md border border-r-0 bg-muted px-3 font-mono text-sm text-muted-foreground">
                      MN
                    </span>
                    <Input
                      id="iban"
                      inputMode="numeric"
                      maxLength={18}
                      placeholder="120005005000123456"
                      className="tabular h-10 rounded-l-none font-mono tracking-wider"
                      aria-invalid={!!errors.iban}
                      {...form.register('iban', {
                        setValueAs: (v: string) =>
                          v.replace(/^mn/i, '').replace(/\s/g, ''),
                      })}
                    />
                  </div>
                </FormField>
              </div>
              {input('holder_last_name', t('details.holderLastName'))}
              {input('holder_first_name', t('details.holderFirstName'))}
            </Section>

            <TaxExemptField
              status={me.tax_exempt_status}
              checked={form.watch('tax_exempt')}
              onChange={(v) =>
                form.setValue('tax_exempt', v, { shouldDirty: true })
              }
            />
          </>
        )}

        <ApiErrorAlert error={error} />

        <div className="flex justify-end gap-2">
          {isDirty && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => form.reset(initial(me))}
            >
              {t('common.cancel')}
            </Button>
          )}
          <Button type="submit" className="h-10 px-5" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {submitLabel ?? t('common.save')}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

const taxStatus: Record<TaxExemptStatus, string> = {
  requested: 'bg-warning/15 text-warning-foreground dark:text-warning',
  approved: 'bg-success/12 text-success',
  rejected: 'bg-destructive/10 text-destructive',
};

/** The interest tax exemption: checking requests it, unchecking withdraws it. */
function TaxExemptField({
  status,
  checked,
  onChange,
}: {
  status?: TaxExemptStatus;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const { t } = useTranslation();
  return (
    <label
      htmlFor="tax_exempt"
      className={cn(
        'flex cursor-pointer gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/40',
        checked && 'border-primary/40 bg-primary/4',
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <PercentIcon className="size-4.5" />
      </span>
      <span className="min-w-0 flex-1 space-y-1">
        <span className="flex flex-wrap items-center gap-2 text-sm font-medium">
          {t('details.tax.title')}
          {status && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[11px] font-medium',
                taxStatus[status],
              )}
            >
              {t(`details.tax.${status}`)}
            </span>
          )}
        </span>
        <span className="block text-sm text-muted-foreground">
          {status === 'rejected'
            ? t('details.tax.rejectedText')
            : status === 'approved'
              ? t('details.tax.approvedText')
              : t('details.tax.text')}
        </span>
      </span>
      <Checkbox
        id="tax_exempt"
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
        className="mt-1"
      />
    </label>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </legend>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
        {children}
      </div>
    </fieldset>
  );
}
