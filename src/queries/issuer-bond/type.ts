import z from 'zod';
import {
  BondFileSchema,
  type frequencySchema,
  RateOptionSchema,
} from '@/queries/bond/type';

export const CurrencySchema = z.enum(['MNT', 'USD']);
export type Currency = z.infer<typeof CurrencySchema>;

export const InterestMethodSchema = z.enum(['actual_days', 'equal']);
export type InterestMethod = z.infer<typeof InterestMethodSchema>;

/** The steps a purchase may grow by (bond.md 3.2). */
export const PURCHASE_UNITS = ['100000', '500000', '1000000'] as const;

/** The live prospectus files a bond keeps (bond.md 3.2). */
export const MAX_PROSPECTUS_FILES = 5;

/** The largest file a bond takes, a prospectus file or its cover. */
export const MAX_BOND_FILE_BYTES = 20 * 1024 * 1024;

export const BondFileKindSchema = z.enum(['prospectus', 'cover']);
export type BondFileKind = z.infer<typeof BondFileKindSchema>;

/**
 * Where a bond of the issuer stands: a draft (a request staff still check), upcoming, selling,
 * paused, closed, or rejected, a request staff turned down with a reason.
 */
export const IssuerBondStatusSchema = z.enum([
  'draft',
  'upcoming',
  'selling',
  'paused',
  'closed',
  'rejected',
]);
export type IssuerBondStatus = z.infer<typeof IssuerBondStatusSchema>;

/** One of the issuer's bonds or requests, as the issuer portal reads it. */
export const IssuerBondSchema = z.object({
  id: z.guid(),
  code: z.string(),
  name: z.string(),
  currency: CurrencySchema,
  total_amount: z.string(),
  min_purchase: z.string(),
  purchase_unit: z.string(),
  investor_cap: z.string().optional(),
  sale_start: z.string(),
  sale_end: z.string().optional(),
  interest_method: InterestMethodSchema,
  issuer_cutoff: z.string(),
  prospectus: z.string(),
  has_guarantee: z.boolean(),
  exit_fee_rate: z.string(),
  penalty_rate: z.string(),
  manual_state: z.string(),
  sales_status: IssuerBondStatusSchema,
  sold: z.string(),
  remaining: z.string(),
  requested_at: z.string().optional(),
  requester_name: z.string().optional(),
  reject_reason: z.string().optional(),
  created_at: z.string(),
});
export type IssuerBondType = z.infer<typeof IssuerBondSchema>;

export const IssuerBondDetailSchema = IssuerBondSchema.extend({
  rate_options: z.array(RateOptionSchema),
  files: z.array(BondFileSchema),
});
export type IssuerBondDetailType = z.infer<typeof IssuerBondDetailSchema>;

export const IssuerBondListSchema = z.object({
  items: z.array(IssuerBondSchema),
});

/** A rate option as a request writes it. */
export interface RateOptionBody {
  term_min_months: number;
  term_max_months: number;
  interest_frequency: z.infer<typeof frequencySchema>;
  annual_rate: string;
}

/** A request's terms; an empty cap or last day of sales is left out, meaning none. */
export interface BondRequestBody {
  code: string;
  name: string;
  currency: Currency;
  total_amount: string;
  min_purchase: string;
  purchase_unit: string;
  investor_cap?: string;
  sale_start: string;
  sale_end?: string;
  interest_method: InterestMethod;
  issuer_cutoff: string;
  prospectus: string;
  has_guarantee: boolean;
  exit_fee_rate: string;
  penalty_rate: string;
  rate_options: RateOptionBody[];
}

/** Whether staff still check this request. */
export function isOpenRequest(b: IssuerBondType): boolean {
  return !!b.requested_at && b.manual_state === 'draft';
}
