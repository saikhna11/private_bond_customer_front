import z from 'zod';

export const ClientTypeSchema = z.enum([
  'customer',
  'foreign',
  'organization',
  'org_member',
]);
export const ReviewStatusSchema = z.enum(['pending', 'approved', 'rejected']);

export const BankAccountSchema = z.object({
  bank_name: z.string(),
  account_number: z.string(),
  iban: z.string(),
  holder_last_name: z.string(),
  holder_first_name: z.string(),
});
export type BankAccountType = z.infer<typeof BankAccountSchema>;

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
  bank_account: BankAccountSchema.optional(),
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
  /** Individuals: replaces the account bond payments go to. */
  bank_account?: BankAccountType;
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
