import z from 'zod';

const partyTypeSchema = z.enum([
  'holder',
  'co_holder',
  'organization',
  'guardian',
  'minor',
  'issuer',
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
 * A purchase is ordered unpaid (pending_payment) under a payment reference; the bank transfer
 * naming it (or the test button) pays and numbers it, and it then waits
 * pending_customer_signature until every client party has signed from their own account,
 * then pending_issuer_signature until the bond issuer's director signs; rendering while the
 * signed PDF is made. Its clients neither decline a paid contract nor let it expire: only
 * the director declines it (cancelled, with a decline_reason) or lets their 72 hours pass
 * (expired), and the payment is then refunded.
 */
export const contractStatusSchema = z.enum([
  'draft',
  'pending_payment',
  'pending_customer_signature',
  'pending_issuer_signature',
  'rendering',
  'signed',
  'cancelled',
  'expired',
  'failed',
]);

const frequencySchema = z.enum([
  'monthly',
  'bimonthly',
  'quarterly',
  'semi_annual',
  'annual',
  'at_maturity',
]);

const cancelReasonSchema = z.enum(['declined', 'expired']);

/** A company account a buyer pays an order into. */
const PaymentAccountSchema = z.object({
  bank_name: z.string(),
  account_number: z.string(),
  iban: z.string(),
  account_name: z.string(),
});

/**
 * How an order is paid: amount in currency into account, naming reference, before deadline.
 * received is what the transfers applied to it add up to; mock says the test button pays it.
 * money is, per currency, what it received, keeps, gave back and has left to give back.
 */
export const PaymentSchema = z.object({
  reference: z.string(),
  deadline: z.string(),
  amount: z.string(),
  currency: z.string(),
  received: z.string(),
  money: z.array(
    z.object({
      currency: z.string(),
      received: z.string(),
      kept: z.string(),
      refunded: z.string(),
      refundable: z.string(),
    }),
  ),
  account: PaymentAccountSchema.optional(),
  mock: z.boolean(),
  /** The test button makes a real transfer through the local fake bank, of any amount. */
  mock_bank: z.boolean(),
});

/**
 * A contract in the list: no parties or signatures. Its number comes with its payment;
 * awaiting_signature says it waits for the client's own.
 */
export const ContractSummarySchema = z.object({
  id: z.uuid(),
  status: contractStatusSchema,
  contract_no: z.string().optional(),
  contract_prefix: z.string(),
  contract_date: z.string(),
  currency: z.string(),
  principal_amount: z.string(),
  signature_deadline: z.string().optional(),
  payment_deadline: z.string().optional(),
  cancel_reason: cancelReasonSchema.optional(),
  created_at: z.string(),
  signed_at: z.string().optional(),
  awaiting_signature: z.boolean(),
});

/**
 * A contract with its parties and signatures, as the client reads it: your_party_id is
 * theirs. On the issuer portal it is the issuer party for the director while the contract
 * awaits their signature, and left out otherwise. Amounts and rates are decimal strings.
 */
export const ContractSchema = z.object({
  id: z.uuid(),
  status: contractStatusSchema,
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
  /** The day it was paid, which started and numbered it. */
  paid_on: z.string().optional(),
  payment_source: z.enum(['mock', 'admin', 'payment']).optional(),
  payment_reference: z.string().optional(),
  payment_deadline: z.string().optional(),
  signature_deadline: z.string().optional(),
  cancel_reason: cancelReasonSchema.optional(),
  cancelled_at: z.string().optional(),
  /** Why the bond issuer's director declined it; left out when a client declined it. */
  decline_reason: z.string().optional(),
  signed_at: z.string().optional(),
  /** Where the bond repays the holder, as the contract was bought. */
  repayment_bank_name: z.string(),
  repayment_account_no: z.string(),
  repayment_iban: z.string(),
  repayment_owner: z.string(),
  parties: z.array(PartySchema),
  signatures: z.array(SignatureSchema),
  your_party_id: z.uuid().optional(),
  /** The underwriter the contract names beside its parties; it does not sign. */
  underwriter: z.string(),
  /** How it is paid; left out for a contract never ordered with a reference. */
  payment: PaymentSchema.optional(),
});

export type PaymentType = z.infer<typeof PaymentSchema>;
export type PartyType = z.infer<typeof PartySchema>;
export type ContractType = z.infer<typeof ContractSchema>;
export type ContractSummaryType = z.infer<typeof ContractSummarySchema>;

/**
 * Who a contract names: a holder alone, with a co-holder, a minor with their guardian, or
 * an organization.
 */
export const ownershipSchema = z.enum([
  'individual',
  'joint',
  'minor',
  'organization',
]);
export type Ownership = z.infer<typeof ownershipSchema>;

/** The kinds a holder can buy now: alone, or with a co-holder who signs too. */
export const purchasableOwnershipSchema = z.enum(['individual', 'joint']);
export type PurchasableOwnership = z.infer<typeof purchasableOwnershipSchema>;

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
 * What the browser fills a stored contract's document from, with the signatures its parties
 * gave so far (GET /contracts/{id}/preview): the values kept when it was paid.
 */
export const ContractPreviewSchema = z.object({
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
  // Sums the values and schedule.
  values_hash: z.string(),
});

export type PreviewPartyType = z.infer<typeof PreviewPartySchema>;
export type ContractPreviewType = z.infer<typeof ContractPreviewSchema>;

/**
 * A contract's co-holder: another approved client's register number (a foreigner's
 * passport number) and phone, both. It stays in the page's memory, never the URL.
 */
export interface CoHolder {
  register_no: string;
  phone: string;
}
