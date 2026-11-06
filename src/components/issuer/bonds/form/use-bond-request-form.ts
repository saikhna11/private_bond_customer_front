import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';
import {
  type BondRequestBody,
  CurrencySchema,
  InterestMethodSchema,
  PURCHASE_UNITS,
} from '@/queries/issuer-bond/type';
import { overlaps, rateOptionSchema } from './rate-option-rules';

/** A bond request's form schema, with t's messages (bond.md 3.2, 4). */
function requestSchema(t: TFunction) {
  const amount = z
    .string()
    .regex(/^\d{1,26}$/, t('issuer.bonds.form.errors.amount'));
  const percent = z
    .string()
    .trim()
    .regex(/^\d{1,15}(\.\d{1,6})?$/, t('issuer.bonds.form.errors.percent'));
  return z
    .object({
      code: z
        .string()
        .trim()
        .regex(
          /^[A-Za-zА-Яа-яЁёӨөҮү0-9-]{1,10}$/,
          t('issuer.bonds.form.errors.code'),
        ),
      name: z
        .string()
        .trim()
        .min(1, t('issuer.bonds.form.errors.name'))
        .max(50, t('issuer.bonds.form.errors.name')),
      currency: CurrencySchema,
      total_amount: amount,
      min_purchase: amount,
      purchase_unit: z.enum(PURCHASE_UNITS, t('issuer.bonds.form.errors.unit')),
      investor_cap: amount.or(z.literal('')),
      sale_start: z.string().min(1, t('issuer.bonds.form.errors.date')),
      sale_end: z.string(),
      interest_method: InterestMethodSchema,
      issuer_cutoff: z
        .string()
        .regex(
          /^([01]\d|2[0-3]):[0-5]\d$/,
          t('issuer.bonds.form.errors.cutoff'),
        ),
      prospectus: z
        .string()
        .max(20000, t('issuer.bonds.form.errors.prospectus')),
      has_guarantee: z.boolean(),
      exit_fee_rate: percent,
      penalty_rate: percent,
      rate_options: z.array(rateOptionSchema(t)).min(1),
    })
    .superRefine((v, ctx) => {
      const unit = BigInt(v.purchase_unit);
      const issue = (path: string, message: string) =>
        ctx.addIssue({ code: 'custom', path: [path], message });
      const ok = (s: string) => /^\d+$/.test(s);
      if (ok(v.min_purchase)) {
        const min = BigInt(v.min_purchase);
        if (min === 0n || min % unit !== 0n) {
          issue('min_purchase', t('issuer.bonds.form.errors.minPurchase'));
        }
        if (ok(v.total_amount)) {
          const total = BigInt(v.total_amount);
          if (total < min || total % unit !== 0n) {
            issue('total_amount', t('issuer.bonds.form.errors.multiple'));
          }
        }
        if (ok(v.investor_cap)) {
          const cap = BigInt(v.investor_cap);
          if (cap !== 0n && (cap < min || cap % unit !== 0n)) {
            issue('investor_cap', t('issuer.bonds.form.errors.multiple'));
          }
        }
      }
      if (v.sale_end && v.sale_end < v.sale_start) {
        issue('sale_end', t('issuer.bonds.form.errors.saleEnd'));
      }
      v.rate_options.forEach((o, i) => {
        if (v.rate_options.slice(0, i).some((p) => overlaps(o, p))) {
          ctx.addIssue({
            code: 'custom',
            path: ['rate_options', i, 'term_max_months'],
            message: t('issuer.bonds.form.errors.overlap'),
          });
        }
      });
    });
}

export type BondRequestValues = z.infer<ReturnType<typeof requestSchema>>;

/** The form's names of the API's body fields, for its field errors. */
export const requestFieldNames = {
  code: 'code',
  name: 'name',
  total_amount: 'total_amount',
  min_purchase: 'min_purchase',
  purchase_unit: 'purchase_unit',
  investor_cap: 'investor_cap',
  sale_start: 'sale_start',
  sale_end: 'sale_end',
  issuer_cutoff: 'issuer_cutoff',
  prospectus: 'prospectus',
  exit_fee_rate: 'exit_fee_rate',
  penalty_rate: 'penalty_rate',
} as const;

export function emptyRateOption(): BondRequestValues['rate_options'][number] {
  return {
    term_min_months: 12,
    term_max_months: 12,
    interest_frequency: 'monthly',
    annual_rate: '',
  };
}

const defaults: BondRequestValues = {
  code: '',
  name: '',
  currency: 'MNT',
  total_amount: '',
  min_purchase: '',
  purchase_unit: '500000',
  investor_cap: '',
  sale_start: '',
  sale_end: '',
  interest_method: 'actual_days',
  issuer_cutoff: '11:00',
  prospectus: '',
  has_guarantee: false,
  exit_fee_rate: '0.1',
  penalty_rate: '0.1',
  rate_options: [emptyRateOption()],
};

/** The request's body; an empty cap or last day of sales is left out, meaning none. */
export function requestBody(v: BondRequestValues): BondRequestBody {
  return {
    ...v,
    investor_cap: v.investor_cap || undefined,
    sale_end: v.sale_end || undefined,
  };
}

/** A new bond request's form, with one empty rate option. */
export function useBondRequestForm() {
  const { t } = useTranslation();
  const schema = useMemo(() => requestSchema(t), [t]);
  return useForm<BondRequestValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });
}
