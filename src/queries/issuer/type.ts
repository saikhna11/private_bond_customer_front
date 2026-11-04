import * as z from 'zod';

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

export const IssuerBankAccountSchema = z.object({
  currency: z.enum(['MNT', 'USD']),
  bank_name: z.string(),
  account_number: z.string(),
  iban: z.string(),
  account_name: z.string(),
  status: z.enum(['unverified', 'verified', 'mismatch', 'not_found']),
  updated_at: z.string(),
});
export type IssuerBankAccountType = z.infer<typeof IssuerBankAccountSchema>;

export const IssuerSchema = z.object({
  id: z.string(),
  name: z.string(),
  register_number: z.string(),
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
