import z from 'zod';

const partyTypeSchema = z.enum([
  'holder',
  'co_holder',
  'organization',
  'guardian',
  'minor',
]);

/**
 * A person or organization a contract names, at their place among the parties its template
 * names. A party who signs does it from their own account: signed_at is when, declined_at
 * when they declined instead.
 */
const PartySchema = z.object({
  id: z.uuid(),
  position: z.number(),
  type: partyTypeSchema,
  signs: z.boolean(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  organization_name: z.string().optional(),
  register_no: z.string(),
  phone: z.string().optional(),
  signed_at: z.string().optional(),
  declined_at: z.string().optional(),
});

const SignatureSchema = z.object({
  id: z.uuid(),
  party_id: z.uuid(),
  hash: z.string(),
  signed_at: z.string(),
});

/**
 * pending_signature until every party has signed from their own account; rendering while
 * the signed PDF is made; cancelled when a party declined or the deadline passed.
 */
const statusSchema = z.enum([
  'draft',
  'pending_signature',
  'rendering',
  'signed',
  'cancelled',
  'expired',
  'failed',
]);

const frequencySchema = z.enum([
  'monthly',
  'quarterly',
  'semi_annual',
  'annual',
  'at_maturity',
]);

const cancelReasonSchema = z.enum(['declined', 'expired']);

/**
 * A contract in the list: no parties or signatures. Its number comes with the last
 * signature; awaiting_signature says it waits for the client's own.
 */
export const ContractSummarySchema = z.object({
  id: z.uuid(),
  status: statusSchema,
  contract_no: z.string().optional(),
  contract_prefix: z.string(),
  contract_date: z.string(),
  currency: z.string(),
  principal_amount: z.string(),
  signature_deadline: z.string().optional(),
  cancel_reason: cancelReasonSchema.optional(),
  created_at: z.string(),
  signed_at: z.string().optional(),
  awaiting_signature: z.boolean(),
});

/**
 * A contract with its parties and signatures, as the client reads it: your_party_id is
 * theirs. Amounts and rates are decimal strings.
 */
export const ContractSchema = z.object({
  id: z.uuid(),
  status: statusSchema,
  contract_no: z.string().optional(),
  contract_prefix: z.string(),
  contract_date: z.string(),
  start_date: z.string(),
  maturity_date: z.string(),
  currency: z.string(),
  principal_amount: z.string(),
  annual_rate: z.string(),
  tax_rate: z.string(),
  term_months: z.number(),
  interest_frequency: frequencySchema,
  signature_deadline: z.string().optional(),
  cancel_reason: cancelReasonSchema.optional(),
  cancelled_at: z.string().optional(),
  signed_at: z.string().optional(),
  parties: z.array(PartySchema),
  signatures: z.array(SignatureSchema),
  your_party_id: z.uuid(),
});

export type PartyType = z.infer<typeof PartySchema>;
export type ContractType = z.infer<typeof ContractSchema>;
export type ContractSummaryType = z.infer<typeof ContractSummarySchema>;

/**
 * A bond's product name, as GET /products lists it: the backend decides which bonds are
 * on sale, so the app names none of them.
 */
export type Product = string;

/** A bond on sale: its terms and the template its contracts are drafted from. */
export const BondProductSchema = z.object({
  name: z.string(),
  annual_rate: z.string(),
  term_months: z.number(),
  interest_frequency: frequencySchema,
  co_holder: z.boolean(),
  available: z.boolean(),
  template: z
    .object({
      id: z.uuid(),
      name: z.string(),
      status: z.enum(['draft', 'active', 'inactive']),
    })
    .optional(),
});

export type BondProductType = z.infer<typeof BondProductSchema>;

/** A person the previewed contract names, at their place among its parties. */
const PreviewPartySchema = z.object({
  position: z.number(),
  type: partyTypeSchema,
  signs: z.boolean(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  register_no: z.string(),
});

/**
 * A signature a party already gave the previewed contract: a base64 PNG, and the Alt Text
 * of the template picture it replaces.
 */
const PreviewSignatureSchema = z.object({
  party_id: z.uuid(),
  picture: z.string(),
  image: z.string(),
});

/**
 * What the browser fills a contract's document from: a product's before anything is
 * stored (POST /products/{name}/preview), or a stored contract's with the signatures its
 * parties gave so far (GET /contracts/{id}/preview). The number ends in ___ until the last
 * party signs.
 */
export const ProductPreviewSchema = z.object({
  product: z.string(),
  template: z.object({ id: z.uuid(), name: z.string() }),
  contract_no: z.string(),
  contract_date: z.string(),
  maturity_date: z.string(),
  currency: z.string(),
  principal_amount: z.string(),
  annual_rate: z.string(),
  term_months: z.number(),
  interest_frequency: frequencySchema,
  parties: z.array(PreviewPartySchema),
  values: z.record(z.string(), z.string()),
  // The schedule's placeholders and one row of their values per payment: its table row
  // repeats once per payment.
  schedule_keys: z.array(z.string()),
  schedule: z.array(z.record(z.string(), z.string())),
  signatures: z.array(PreviewSignatureSchema),
});

export type PreviewPartyType = z.infer<typeof PreviewPartySchema>;
export type ProductPreviewType = z.infer<typeof ProductPreviewSchema>;

/**
 * A contract's co-holder: another approved client's register number (a foreigner's
 * passport number) and phone, both. It stays in the page's memory, never the URL.
 */
export interface CoHolder {
  register_no: string;
  phone: string;
}

/**
 * POST /contracts: the client's own signature on the preview, a base64 PNG without the
 * data URL prefix, which stores the contract; the backend fills the rest from the bond's
 * sample order. Each other party signs from their own account. request_id names the
 * purchase: sent again, it answers the contract the first request stored.
 */
export interface CreateContractBody {
  product: Product;
  template_id: string;
  request_id: string;
  co_holder?: CoHolder;
  signature: string;
}
