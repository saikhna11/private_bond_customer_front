import type { MeType } from '@/queries/auth/type';

/** A person's register number: 2 Cyrillic letters and 8 digits, uppercased. */
export const PERSON_REGISTER = /^[А-ЯЁӨҮ]{2}[0-9]{8}$/;

/** An organization's register number. */
export const ORG_REGISTER = /^\d{7}$/;

export function isIndividual(me: MeType) {
  return me.type === 'customer' || me.type === 'foreign';
}

/**
 * A member signs in for their organization and acts for it: its profile, officers and,
 * later, its services. The organization itself has no login.
 */
export function actsForOrg(me: MeType) {
  return me.type === 'organization' || me.type === 'org_member';
}

/** Clients who complete and edit a profile: their own, or a member their organization's. */
export function editsProfile(me: MeType) {
  return isIndividual(me) || actsForOrg(me);
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
