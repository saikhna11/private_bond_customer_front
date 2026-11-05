import * as z from 'zod';
import { contractStatusSchema } from '@/queries/contract/type';

export const IssuerMemberSchema = z.object({
  id: z.string(),
  issuer_id: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  last_name: z.string(),
  first_name: z.string(),
  position: z.string().optional(),
  role: z.enum(['director', 'staff']),
  is_active: z.boolean(),
  created_at: z.string(),
});
export type IssuerMemberType = z.infer<typeof IssuerMemberSchema>;

/** One of the issuer's accounts; an issuer can hold several per currency. */
export const IssuerBankAccountSchema = z.object({
  id: z.string(),
  currency: z.enum(['MNT', 'USD']),
  bank_name: z.string(),
  account_number: z.string(),
  iban: z.string(),
  account_name: z.string(),
  status: z.enum(['unverified', 'verified', 'mismatch', 'not_found']),
  /** The currency's default account. */
  is_default: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type IssuerBankAccountType = z.infer<typeof IssuerBankAccountSchema>;

export const IssuerSchema = z.object({
  id: z.string(),
  name: z.string(),
  register_number: z.string(),
  state_register_number: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  members: z.array(IssuerMemberSchema),
  bank_accounts: z.array(IssuerBankAccountSchema),
});
export type IssuerType = z.infer<typeof IssuerSchema>;

/** GET /issuer/me: the signed-in member and their bond issuer. */
export const IssuerMeSchema = z.object({
  member: IssuerMemberSchema,
  issuer: IssuerSchema,
});
export type IssuerMeType = z.infer<typeof IssuerMeSchema>;

/** POST /auth/issuer/login, /refresh and /password. */
export const IssuerSignedInSchema = IssuerMemberSchema.extend({
  access_expires_at: z.string(),
});

/**
 * The issuer portal's contract tabs: pending awaits the director's signature, valid is
 * signed by every party (its PDF rendering, rendered or failed), cancelled was declined by
 * the director or expired.
 */
export const issuerContractTabSchema = z.enum([
  'pending',
  'valid',
  'cancelled',
]);
export type IssuerContractTab = z.infer<typeof issuerContractTabSchema>;

/** A contract party's names: a person's, or an organization's name as first_name. */
const PartyNameSchema = z.object({
  last_name: z.string(),
  first_name: z.string(),
});
export type PartyNameType = z.infer<typeof PartyNameSchema>;

/**
 * One of the issuer's contracts in the portal's list: its terms and state, its bond's name,
 * and its holder's and, for a joint one, co-holder's names. Amounts are decimal strings.
 */
export const IssuerContractSummarySchema = z.object({
  id: z.uuid(),
  status: contractStatusSchema,
  contract_no: z.string().optional(),
  contract_prefix: z.string(),
  contract_date: z.string(),
  maturity_date: z.string(),
  currency: z.string(),
  principal_amount: z.string(),
  term_months: z.number(),
  signature_deadline: z.string().optional(),
  cancelled_at: z.string().optional(),
  signed_at: z.string().optional(),
  paid_on: z.string().optional(),
  bond_name: z.string(),
  holder: PartyNameSchema,
  co_holder: PartyNameSchema.optional(),
});
export type IssuerContractSummaryType = z.infer<
  typeof IssuerContractSummarySchema
>;

/** GET /issuer/contracts: a page of one tab, and every tab's count. */
export const IssuerContractPageSchema = z.object({
  items: z.array(IssuerContractSummarySchema),
  total: z.number(),
  page: z.number(),
  size: z.number(),
  counts: z.record(issuerContractTabSchema, z.number()),
});
export type IssuerContractPageType = z.infer<typeof IssuerContractPageSchema>;
