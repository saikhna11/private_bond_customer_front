import type { ParseKeys } from 'i18next';
import {
  Controller,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormField } from '@/components/common/form-field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { banks, ibanChecksumValid, ibanMatchesAccount } from '@/lib/banks';
import { actsForOrg } from '@/lib/client';
import type { MeType } from '@/queries/auth/type';

/** A bank account as a form holds it: the IBAN without its fixed MN. */
export interface BankFieldValues {
  bank_name: string;
  account_number: string;
  iban: string;
  holder_account_name: string;
}

type BankKey = keyof BankFieldValues;

/** The account's name until one is typed: an organization's, or the person's. */
export function defaultHolderName(me: MeType): string {
  return actsForOrg(me)
    ? (me.name ?? '')
    : [me.last_name, me.first_name].filter(Boolean).join(' ');
}

/** The form's 18 digits, from a saved MN IBAN. */
export function ibanDigits(iban?: string): string {
  return iban?.replace(/^mn/i, '') ?? '';
}

/**
 * What is wrong with an account's fields, as message keys. A person's account name is
 * stored in up to 100 characters, an organization's in up to 200.
 */
export function bankAccountIssues(
  v: BankFieldValues,
  organization: boolean,
): { path: BankKey; key: ParseKeys }[] {
  const out: { path: BankKey; key: ParseKeys }[] = [];
  const need = (ok: boolean, path: BankKey, key: ParseKeys) => {
    if (!ok) out.push({ path, key });
  };
  const accountOk = /^\d{6,20}$/.test(v.account_number);
  need(v.bank_name !== '', 'bank_name', 'details.errors.bank');
  need(v.bank_name.length <= 100, 'bank_name', 'validation.tooLong');
  need(accountOk, 'account_number', 'details.errors.accountNumber');
  need(/^\d{18}$/.test(v.iban), 'iban', 'details.errors.iban');
  if (/^\d{18}$/.test(v.iban)) {
    const iban = `MN${v.iban}`;
    const valid = ibanChecksumValid(iban);
    need(valid, 'iban', 'details.errors.ibanChecksum');
    if (valid && accountOk)
      need(
        ibanMatchesAccount(iban, v.account_number),
        'account_number',
        'details.errors.ibanMismatch',
      );
  }
  need(
    v.holder_account_name !== '',
    'holder_account_name',
    'details.errors.holderAccountName',
  );
  need(
    v.holder_account_name.length <= (organization ? 200 : 100),
    'holder_account_name',
    'validation.tooLong',
  );
  return out;
}

/** The API's field locations of an account, to the form's fields. */
export const bankFieldErrors = {
  bank_name: 'bank_name',
  account_number: 'account_number',
  iban: 'iban',
  holder_account_name: 'holder_account_name',
  'bank_account.bank_name': 'bank_name',
  'bank_account.account_number': 'account_number',
  'bank_account.iban': 'iban',
  'bank_account.holder_account_name': 'holder_account_name',
} as const;

/** The codes that belong to one field of the account. */
export const bankFieldOf: Partial<Record<string, BankKey>> = {
  'client.iban_invalid': 'iban',
  'client.iban_mismatch': 'account_number',
  'bank.account_exists': 'iban',
};

/**
 * The bank, account number, IBAN and holder's name of an account, as grid cells of a
 * two-column layout. Works on any form whose values include BankFieldValues.
 */
export function BankAccountFields<T extends FieldValues & BankFieldValues>({
  form,
  organization,
  idPrefix = '',
}: {
  form: UseFormReturn<T>;
  organization: boolean;
  /** Keeps ids unique when the fields show twice on a page. */
  idPrefix?: string;
}) {
  const { t } = useTranslation();
  const { errors } = form.formState;
  const name = (k: BankKey) => k as Path<T>;
  const id = (k: BankKey) => `${idPrefix}${k}`;
  const error = (k: BankKey) => errors[k]?.message as string | undefined;

  return (
    <>
      <FormField
        id={id('bank_name')}
        label={t('details.bank')}
        error={error('bank_name')}
      >
        <Controller
          control={form.control}
          name={name('bank_name')}
          render={({ field }) => (
            <Select
              value={(field.value as string) || undefined}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id={id('bank_name')}
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
                {field.value && !banks.some((b) => b.value === field.value) && (
                  <SelectItem value={field.value as string}>
                    {field.value as string}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField
        id={id('account_number')}
        label={t('details.accountNumber')}
        error={error('account_number')}
      >
        <Input
          id={id('account_number')}
          inputMode="numeric"
          maxLength={20}
          placeholder="5000123456"
          className="tabular h-10"
          aria-invalid={!!errors.account_number}
          {...form.register(name('account_number'))}
        />
      </FormField>
      <div className="sm:col-span-2">
        <FormField
          id={id('iban')}
          label={t('details.iban')}
          error={error('iban')}
          hint={t('details.ibanHint')}
        >
          <div className="flex">
            <span className="inline-flex h-10 items-center rounded-l-md border border-r-0 bg-muted px-3 font-mono text-sm text-muted-foreground">
              MN
            </span>
            <Input
              id={id('iban')}
              inputMode="numeric"
              maxLength={18}
              placeholder="300005005000123456"
              className="tabular h-10 rounded-l-none font-mono tracking-wider"
              aria-invalid={!!errors.iban}
              {...form.register(name('iban'), {
                setValueAs: (v: string) =>
                  v.replace(/^mn/i, '').replace(/\s/g, ''),
              })}
            />
          </div>
        </FormField>
      </div>
      <div className="sm:col-span-2">
        <FormField
          id={id('holder_account_name')}
          label={t('details.holderAccountName')}
          error={error('holder_account_name')}
          hint={t(
            organization
              ? 'details.holderAccountNameOrgHint'
              : 'details.holderAccountNameHint',
          )}
        >
          <Input
            id={id('holder_account_name')}
            className="h-10"
            autoComplete={organization ? 'organization' : 'name'}
            maxLength={organization ? 200 : 100}
            aria-invalid={!!errors.holder_account_name}
            {...form.register(name('holder_account_name'))}
          />
        </FormField>
      </div>
    </>
  );
}
