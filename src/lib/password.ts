import * as z from 'zod';
import { msg } from '@/lib/i18n';

/** Each rule's label is `password.rules.<key>` in the locale files. */
export const passwordRules = [
  { key: 'length', test: (v: string) => v.length >= 8 },
  { key: 'upper', test: (v: string) => /\p{Lu}/u.test(v) },
  { key: 'lower', test: (v: string) => /\p{Ll}/u.test(v) },
  { key: 'digit', test: (v: string) => /\d/.test(v) },
  { key: 'symbol', test: (v: string) => /[^\p{L}\p{N}\s]/u.test(v) },
] as const;

export const passwordSchema = z
  .string()
  .max(128, msg('password.tooLong'))
  .refine((v) => passwordRules.every((r) => r.test(v)), msg('password.weak'));
