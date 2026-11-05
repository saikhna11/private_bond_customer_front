import z from 'zod';

export const ClientTypeSchema = z.enum([
  'customer',
  'foreign',
  'organization',
  'org_member',
]);
export const ReviewStatusSchema = z.enum(['pending', 'approved', 'rejected']);

export const CurrencySchema = z.enum(['MNT', 'USD']);
export type Currency = z.infer<typeof CurrencySchema>;

/** Only a verified account takes payments; any change puts it back to unverified. */
export const BankAccountStatusSchema = z.enum([
  'unverified',
  'verified',
  'mismatch',
  'not_found',
]);
export type BankAccountStatus = z.infer<typeof BankAccountStatusSchema>;

export const BankAccountSchema = z.object({
  id: z.string(),
  bank_name: z.string(),
  account_number: z.string(),
  iban: z.string(),
  currency: CurrencySchema,
  /** The name the account is held in: the person's, or the organization's. */
  holder_account_name: z.string(),
  status: BankAccountStatusSchema,
  /** The currency's default: its bond payments go here unless an admin picks another. */
  is_default: z.boolean(),
});
export type BankAccountType = z.infer<typeof BankAccountSchema>;

/** GET /me/bank-accounts: each currency's default first. */
export const BankAccountsSchema = z.object({
  items: z.array(BankAccountSchema),
});

/** PUT /me/bank-accounts/{id} and PATCH /me bank_account. */
export interface BankAccountInput {
  bank_name: string;
  account_number: string;
  /** MN and 18 digits. */
  iban: string;
  /** MNT when left out. */
  currency?: Currency;
  holder_account_name: string;
}

/** POST /me/bank-accounts: the first account of a currency is its default anyway. */
export interface AddBankAccountBody extends BankAccountInput {
  is_default?: boolean;
}

export const TaxExemptStatusSchema = z.enum([
  'requested',
  'approved',
  'rejected',
]);
export type TaxExemptStatus = z.infer<typeof TaxExemptStatusSchema>;

/** GET /me: the signed-in client; fields of other types are left out. */
export const MeSchema = z.object({
  id: z.string(),
  type: ClientTypeSchema,
  status: ReviewStatusSchema,
  is_active: z.boolean(),
  email: z.string().optional(),
  phone: z.string().optional(),
  phone_secondary: z.string().optional(),
  address: z.string().optional(),
  phone_verified: z.boolean(),
  email_verified: z.boolean(),
  has_password: z.boolean(),
  profile_complete: z.boolean(),
  last_name: z.string().optional(),
  first_name: z.string().optional(),
  register_number: z.string().optional(),
  nationality: z.string().optional(),
  passport_number: z.string().optional(),
  name: z.string().optional(),
  activity: z.string().optional(),
  tax_exempt_status: TaxExemptStatusSchema.optional(),
  tax_exempt_reviewed_at: z.string().optional(),
  /** The account contracts print: the MNT default, else another default. */
  bank_account: BankAccountSchema.optional(),
  /** Every account, each currency's default first; a member gets their organization's. */
  bank_accounts: z.array(BankAccountSchema).default([]),
  org_id: z.string().optional(),
  org_name: z.string().optional(),
  position: z.string().optional(),
  reviewed_at: z.string().optional(),
  reject_reason: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type MeType = z.infer<typeof MeSchema>;
export type ClientType = z.infer<typeof ClientTypeSchema>;
export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;

export const SignedInSchema = z.object({
  session_id: z.string(),
  access_expires_at: z.string(),
});
export type SignedInType = z.infer<typeof SignedInSchema>;

export const CodeSentSchema = z.object({
  channel: z.enum(['sms', 'email']),
  sent_to: z.string(),
  expires_at: z.string(),
});
export type CodeSentType = z.infer<typeof CodeSentSchema>;

export const ResetTokenSchema = z.object({
  reset_token: z.string(),
  expires_at: z.string(),
});
export type ResetTokenType = z.infer<typeof ResetTokenSchema>;

export interface SignupBody {
  type: 'customer' | 'foreign';
  last_name: string;
  first_name: string;
  email: string;
  /** 8 digits; a customer's code goes here by SMS, a foreigner's to the email. */
  phone: string;
  password: string;
}

/**
 * POST /auth/signup/organization: the register number is the login; the person signing up
 * becomes the first officer, and the code goes to their phone by SMS.
 */
export interface SignupOrganizationBody {
  /** 7 digits. */
  register_number: string;
  last_name: string;
  first_name: string;
  email: string;
  /** 8 digits for Mongolia, else + code and digits. */
  phone: string;
  password: string;
}

/** PATCH /me: send only what changed. */
export interface UpdateMeBody {
  phone_secondary?: string;
  address?: string;
  last_name?: string;
  first_name?: string;
  register_number?: string;
  nationality?: string;
  passport_number?: string;
  /**
   * Individuals and organizations (a member for theirs): replaces the default account of
   * its currency, or adds it as the default when there is none.
   */
  bank_account?: BankAccountInput;
  /** Customers: true requests the interest tax exemption, false withdraws it. */
  tax_exempt?: boolean;
  /** Organizations: with activity and address, the only fields they change here. */
  name?: string;
  activity?: string;
}

/** The name to greet the client with. */
export function displayName(me: MeType): string {
  // An organization names itself after sign-up; until then its register number.
  if (me.type === 'organization') return me.name || (me.register_number ?? '');
  return [me.last_name, me.first_name].filter(Boolean).join(' ');
}
