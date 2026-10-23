import type { MeType } from '@/queries/auth/type';

/** A person's register number: 2 Cyrillic letters and 8 digits, uppercased. */
export const PERSON_REGISTER = /^[А-ЯЁӨҮ]{2}[0-9]{8}$/;

/** An organization's register number, its login. */
export const ORG_REGISTER = /^\d{7}$/;

export function isIndividual(me: MeType) {
  return me.type === 'customer' || me.type === 'foreign';
}

/** Clients who complete and edit their own profile (members are read-only). */
export function editsProfile(me: MeType) {
  return isIndividual(me) || me.type === 'organization';
}

export function initials(me: MeType): string {
  const source =
    me.type === 'organization'
      ? (me.name ?? '')
      : `${me.first_name ?? ''} ${me.last_name ?? ''}`;
  return (
    source
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || 'U'
  );
}
