import z from 'zod';
import { ownershipSchema } from '@/queries/contract/type';

export const frequencySchema = z.enum([
  'monthly',
  'bimonthly',
  'quarterly',
  'semi_annual',
  'annual',
  'at_maturity',
]);
export type Frequency = z.infer<typeof frequencySchema>;

/** How many months apart a frequency pays interest; at_maturity pays once, at the end. */
export const frequencyMonths: Record<Frequency, number> = {
  monthly: 1,
  bimonthly: 2,
  quarterly: 3,
  semi_annual: 6,
  annual: 12,
  at_maturity: 0,
};

/**
 * Whether a bond takes purchases today: selling, upcoming before its first day of sales,
 * closed once sold out or past its sales. A client never sees a draft or paused one.
 */
export const salesStatusSchema = z.enum([
  'draft',
  'upcoming',
  'selling',
  'paused',
  'closed',
]);
export type SalesStatus = z.infer<typeof salesStatusSchema>;

/** One row of a bond's rate matrix: a range of terms in months, its frequency and rate. */
export const RateOptionSchema = z.object({
  id: z.guid(),
  term_min_months: z.number(),
  term_max_months: z.number(),
  interest_frequency: frequencySchema,
  annual_rate: z.string(),
});
export type RateOptionType = z.infer<typeof RateOptionSchema>;

export const BondFileSchema = z.object({
  id: z.guid(),
  kind: z.enum(['prospectus', 'cover']),
  file_name: z.string(),
  content_type: z.string(),
  size_bytes: z.number(),
});
export type BondFileType = z.infer<typeof BondFileSchema>;

/** One kind of contract a bond can be bought as, and whether it can be now. */
export const PurchaseOptionSchema = z.object({
  ownership_type: ownershipSchema,
  ttd: z.boolean(),
  available: z.boolean(),
});

/**
 * A published bond as a client reads it. Amounts are decimal strings in its currency, rates
 * percents; remaining is what is still for sale.
 */
export const BondSchema = z.object({
  id: z.guid(),
  bond_issuer_name: z.string(),
  code: z.string(),
  name: z.string(),
  currency: z.string(),
  total_amount: z.string(),
  min_purchase: z.string(),
  purchase_unit: z.string(),
  investor_cap: z.string().optional(),
  sale_start: z.string(),
  sale_end: z.string().optional(),
  prospectus: z.string(),
  has_guarantee: z.boolean(),
  sales_status: salesStatusSchema,
  sold: z.string(),
  remaining: z.string(),
  rate_options: z.array(RateOptionSchema),
  files: z.array(BondFileSchema),
  options: z.array(PurchaseOptionSchema),
});
export type BondType = z.infer<typeof BondSchema>;

/** What a purchase would be if paid today; it has no schedule yet. */
export const QuoteSchema = z.object({
  bond_id: z.guid(),
  code: z.string(),
  currency: z.string(),
  rate_option_id: z.guid(),
  annual_rate: z.string(),
  interest_frequency: frequencySchema,
  term_months: z.number(),
  amount: z.string(),
  tax_rate: z.string(),
  start_date: z.string(),
  maturity_date: z.string(),
  remaining: z.string(),
});
export type QuoteType = z.infer<typeof QuoteSchema>;

/**
 * What a client picks of a bond. A joint contract names its co-holder, who travels in the
 * body, never the URL.
 */
export interface PurchaseBody {
  rate_option_id: string;
  term_months: number;
  amount: string;
  ownership_type: 'individual' | 'joint';
  co_holder?: { register_no: string; phone: string };
}
