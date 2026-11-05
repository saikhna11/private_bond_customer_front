import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import type { ParseKeys } from 'i18next';
import {
  BadgeCheckIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  LandmarkIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  ShieldAlertIcon,
  StarIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { FormField } from '@/components/common/form-field';
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FieldGroup } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useRelocalizedErrors } from '@/hooks/use-relocalized-errors';
import { actsForOrg } from '@/lib/client';
import { type ApiError, toApiError } from '@/lib/fetcher';
import { applyFieldErrors } from '@/lib/form-errors';
import i18n, { apiErrorMessage } from '@/lib/i18n';
import { cn, showToast } from '@/lib/utils';
import {
  useAddBankAccount,
  useRemoveBankAccount,
  useSetDefaultBankAccount,
  useUpdateBankAccount,
  useVerifyBankAccount,
} from '@/queries/auth/hooks';
import { bankAccountsOptions } from '@/queries/auth/options';
import {
  type BankAccountInput,
  type BankAccountStatus,
  type BankAccountType,
  type Currency,
  CurrencySchema,
  type MeType,
} from '@/queries/auth/type';
import {
  BankAccountFields,
  bankAccountIssues,
  bankFieldErrors,
  bankFieldOf,
  defaultHolderName,
  ibanDigits,
} from './bank-account-fields';

const currencies = CurrencySchema.options;

const statusStyle: Record<
  BankAccountStatus,
  { className: string; Icon: typeof ClockIcon }
> = {
  verified: { className: 'bg-success/12 text-success', Icon: CircleCheckIcon },
  unverified: {
    className: 'bg-warning/15 text-warning-foreground dark:text-warning',
    Icon: ClockIcon,
  },
  mismatch: {
    className: 'bg-destructive/10 text-destructive',
    Icon: CircleXIcon,
  },
  not_found: {
    className: 'bg-destructive/10 text-destructive',
    Icon: CircleXIcon,
  },
};

const statusReason: Partial<Record<BankAccountStatus, ParseKeys>> = {
  mismatch: 'details.bankVerification.mismatch',
  not_found: 'details.bankVerification.notFound',
};

/**
 * Every bank account of the client (an organization's for a member), grouped by currency
 * with each currency's default first. Bond payments of a currency go to its default.
 */
export function BankAccountsCard({ me }: { me: MeType }) {
  const { t } = useTranslation();
  const organization = actsForOrg(me);
  const {
    data: accounts,
    isPending,
    error,
  } = useQuery({ ...bankAccountsOptions(), placeholderData: me.bank_accounts });
  const setDefault = useSetDefaultBankAccount();
  const verify = useVerifyBankAccount();
  const remove = useRemoveBankAccount();
  const [lastAccount, setLastAccount] = useState<string | null>(null);

  async function onSetDefault(account: BankAccountType) {
    setLastAccount(null);
    try {
      await setDefault.mutateAsync(account.id);
      showToast(
        'success',
        t('bankAccounts.defaultSet', { currency: account.currency }),
      );
    } catch (err) {
      showToast('error', apiErrorMessage(toApiError(err)));
    }
  }

  async function onVerify(account: BankAccountType) {
    setLastAccount(null);
    try {
      await verify.mutateAsync(account.id);
      showToast('success', t('details.bankVerification.verifiedToast'));
    } catch (err) {
      showToast('error', apiErrorMessage(toApiError(err)));
    }
  }

  async function onRemove(account: BankAccountType) {
    setLastAccount(null);
    try {
      await remove.mutateAsync(account.id);
      showToast('success', t('bankAccounts.removed'));
    } catch (err) {
      const e = toApiError(err);
      if (e.code === 'bank.account_last') {
        setLastAccount(apiErrorMessage(e));
        return;
      }
      showToast('error', apiErrorMessage(e));
    }
  }

  const list = accounts ?? [];
  const groups = currencies
    .map((currency) => ({
      currency,
      items: list.filter((a) => a.currency === currency),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('bankAccounts.title')}</CardTitle>
        <CardDescription>
          {t(
            organization
              ? 'bankAccounts.orgDescription'
              : 'bankAccounts.description',
          )}
        </CardDescription>
        {list.length > 0 && (
          <CardAction>
            <BankAccountDialog
              me={me}
              accounts={list}
              trigger={
                <Button variant="outline" size="sm">
                  <PlusIcon />
                  {t('bankAccounts.add')}
                </Button>
              }
            />
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {lastAccount && (
          <Alert className="border-warning/40 bg-warning/5">
            <CircleAlertIcon />
            <AlertTitle>{t('bankAccounts.lastAccountTitle')}</AlertTitle>
            <AlertDescription>{lastAccount}</AlertDescription>
            <AlertAction>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                aria-label={t('common.cancel')}
                onClick={() => setLastAccount(null)}
              >
                <XIcon />
              </Button>
            </AlertAction>
          </Alert>
        )}

        {isPending && list.length === 0 ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
          </div>
        ) : error && list.length === 0 ? (
          <p className="text-sm text-destructive">
            {apiErrorMessage(toApiError(error))}
          </p>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <LandmarkIcon className="size-5" />
            </span>
            <p className="text-sm text-muted-foreground">
              {t('bankAccounts.empty')}
            </p>
            <BankAccountDialog
              me={me}
              accounts={list}
              trigger={
                <Button className="h-10 rounded-xl">
                  <PlusIcon />
                  {t('bankAccounts.addFirst')}
                </Button>
              }
            />
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.currency} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t(`bankAccounts.currencies.${g.currency}`)}
              </h3>
              <ul className="flex flex-col gap-3">
                {g.items.map((a) => (
                  <BankAccountRow
                    key={a.id}
                    account={a}
                    actions={
                      <>
                        {a.status !== 'verified' && (
                          <Button
                            size="sm"
                            onClick={() => void onVerify(a)}
                            disabled={verify.isPending}
                          >
                            {verify.isPending && verify.variables === a.id ? (
                              <Loader2Icon className="animate-spin" />
                            ) : (
                              <ShieldAlertIcon />
                            )}
                            {verify.isPending && verify.variables === a.id
                              ? t('details.bankVerification.verifying')
                              : t('details.bankVerification.verify')}
                          </Button>
                        )}
                        {!a.is_default && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void onSetDefault(a)}
                            disabled={setDefault.isPending}
                          >
                            {setDefault.isPending &&
                            setDefault.variables === a.id ? (
                              <Loader2Icon className="animate-spin" />
                            ) : (
                              <StarIcon />
                            )}
                            {t('bankAccounts.makeDefault')}
                          </Button>
                        )}
                        <BankAccountDialog
                          me={me}
                          accounts={list}
                          account={a}
                          trigger={
                            <Button variant="outline" size="sm">
                              <PencilIcon />
                              {t('bankAccounts.edit')}
                            </Button>
                          }
                        />
                        <ConfirmDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2Icon />
                              {t('bankAccounts.remove')}
                            </Button>
                          }
                          title={t('bankAccounts.removeTitle')}
                          description={
                            <>
                              {t('bankAccounts.removeText', {
                                bank: a.bank_name,
                                account: a.account_number,
                              })}
                              {a.is_default &&
                                ` ${t('bankAccounts.removeDefaultText')}`}
                            </>
                          }
                          confirmLabel={t('bankAccounts.remove')}
                          onConfirm={() => onRemove(a)}
                        />
                      </>
                    }
                  />
                ))}
              </ul>
            </section>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function BankAccountRow({
  account,
  actions,
}: {
  account: BankAccountType;
  actions: ReactNode;
}) {
  const { t } = useTranslation();
  const style = statusStyle[account.status];
  const reason = statusReason[account.status];

  return (
    <li
      className={cn(
        'rounded-xl border p-4',
        account.is_default && 'border-primary/40 bg-primary/4',
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">{account.bank_name}</span>
        {account.is_default && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
            <StarIcon className="size-3" />
            {t('bankAccounts.default')}
          </span>
        )}
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
            style.className,
          )}
        >
          <style.Icon className="size-3" />
          {t(`bankAccounts.status.${account.status}`)}
        </span>
      </div>
      <dl className="mt-3 grid gap-x-5 gap-y-2 sm:grid-cols-2">
        <Detail label={t('details.accountNumber')}>
          <span className="tabular">{account.account_number}</span>
        </Detail>
        <Detail label={t('details.iban')}>
          <span className="font-mono break-all">{account.iban}</span>
        </Detail>
        <div className="sm:col-span-2">
          <Detail label={t('details.holderAccountName')}>
            {account.holder_account_name}
          </Detail>
        </div>
      </dl>
      {reason && (
        <p className="mt-3 flex items-start gap-1.5 text-sm text-destructive">
          <CircleAlertIcon className="mt-0.5 size-3.5 shrink-0" />
          {t(reason)}
        </p>
      )}
      {account.status === 'verified' && (
        <p className="mt-3 flex items-start gap-1.5 text-sm text-muted-foreground">
          <BadgeCheckIcon className="mt-0.5 size-3.5 shrink-0 text-success" />
          {t('details.bankVerification.verifiedText')}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">{actions}</div>
    </li>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}

/** Adds an account, or edits one when given. */
function BankAccountDialog({
  me,
  accounts,
  account,
  trigger,
}: {
  me: MeType;
  accounts: BankAccountType[];
  account?: BankAccountType;
  trigger: ReactNode;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {account ? t('bankAccounts.editTitle') : t('bankAccounts.addTitle')}
          </DialogTitle>
          <DialogDescription>
            {account
              ? t('bankAccounts.editText')
              : t('bankAccounts.dialogText')}
          </DialogDescription>
        </DialogHeader>
        {/* Mounted only while open, so each opening starts from the saved values. */}
        {open && (
          <BankAccountForm
            me={me}
            accounts={accounts}
            account={account}
            onDone={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

const formSchema = z.object({
  currency: CurrencySchema,
  bank_name: z.string().trim(),
  account_number: z.string().trim(),
  iban: z.string().trim(),
  holder_account_name: z.string().trim(),
  is_default: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

function formRules(organization: boolean) {
  return formSchema.superRefine((v, ctx) => {
    for (const issue of bankAccountIssues(v, organization))
      ctx.addIssue({
        code: 'custom',
        path: [issue.path],
        message: i18n.t(issue.key),
      });
  });
}

function formInitial(me: MeType, account?: BankAccountType): FormValues {
  return {
    currency: account?.currency ?? 'MNT',
    bank_name: account?.bank_name ?? '',
    account_number: account?.account_number ?? '',
    iban: ibanDigits(account?.iban),
    holder_account_name: account?.holder_account_name ?? defaultHolderName(me),
    is_default: account?.is_default ?? false,
  };
}

function BankAccountForm({
  me,
  accounts,
  account,
  onDone,
}: {
  me: MeType;
  accounts: BankAccountType[];
  account?: BankAccountType;
  onDone: () => void;
}) {
  const { t } = useTranslation();
  const organization = actsForOrg(me);
  const add = useAddBankAccount();
  const update = useUpdateBankAccount();
  const [error, setError] = useState<ApiError | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formRules(organization)),
    mode: 'onTouched',
    defaultValues: formInitial(me, account),
  });
  const { errors, isSubmitting } = form.formState;
  useRelocalizedErrors(form);

  const currency = form.watch('currency');
  // The first account of a currency becomes its default anyway.
  const firstOfCurrency = !accounts.some(
    (a) => a.currency === currency && a.id !== account?.id,
  );
  const currencyChanged = !!account && currency !== account.currency;

  async function onSubmit(values: FormValues) {
    setError(null);
    const body: BankAccountInput = {
      bank_name: values.bank_name,
      account_number: values.account_number,
      iban: `MN${values.iban}`,
      currency: values.currency,
      holder_account_name: values.holder_account_name,
    };
    try {
      if (account) {
        const before = formInitial(me, account);
        const keys = [
          'currency',
          'bank_name',
          'account_number',
          'iban',
          'holder_account_name',
        ] as const;
        if (keys.every((k) => values[k] === before[k])) {
          showToast('info', t('details.nothingToChange'));
          return;
        }
        await update.mutateAsync({ id: account.id, body });
        showToast('success', t('bankAccounts.saved'));
      } else {
        await add.mutateAsync({
          ...body,
          is_default: values.is_default || undefined,
        });
        showToast('success', t('bankAccounts.added'));
      }
      onDone();
    } catch (err) {
      const e = toApiError(err);
      const name = bankFieldOf[e.code];
      if (name) {
        form.setError(name, { type: 'server', message: apiErrorMessage(e) });
        return;
      }
      if (
        applyFieldErrors(e, form.setError, {
          ...bankFieldErrors,
          currency: 'currency',
          is_default: 'is_default',
        })
      )
        return;
      setError(e);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-5">
        <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField
              id="bank_account_currency"
              label={t('bankAccounts.currency')}
              error={errors.currency?.message}
              hint={
                currencyChanged
                  ? t('bankAccounts.currencyChangeText')
                  : undefined
              }
            >
              <Controller
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v as Currency)}
                  >
                    <SelectTrigger
                      id="bank_account_currency"
                      className="h-10! w-full"
                      aria-invalid={!!errors.currency}
                      onBlur={field.onBlur}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => (
                        <SelectItem key={c} value={c}>
                          {t(`bankAccounts.currencies.${c}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>
          <BankAccountFields
            form={form}
            organization={organization}
            idPrefix="bank_account_"
          />
        </div>

        {!account && (
          <label
            htmlFor="bank_account_is_default"
            className="flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/40"
          >
            <Checkbox
              id="bank_account_is_default"
              checked={firstOfCurrency || form.watch('is_default')}
              disabled={firstOfCurrency}
              onCheckedChange={(v) => form.setValue('is_default', v === true)}
              className="mt-0.5"
            />
            <span className="min-w-0 space-y-1">
              <span className="block text-sm font-medium">
                {t('bankAccounts.makeDefaultLabel')}
              </span>
              <span className="block text-sm text-muted-foreground">
                {t('bankAccounts.makeDefaultText')}
              </span>
            </span>
          </label>
        )}

        <ApiErrorAlert error={error} />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onDone}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" className="h-10 px-5" disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {account ? t('common.save') : t('bankAccounts.add')}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
