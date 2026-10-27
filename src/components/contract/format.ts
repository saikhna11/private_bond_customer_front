import i18n from '@/lib/i18n';
import type { ContractType, PartyType } from '@/queries/contract/type';

const amountFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** A decimal string as the contract prints it: 1,000,000.00. */
export function formatAmount(value: string): string {
  return amountFormat.format(Number(value));
}

/** How often a contract pays interest, in the current language. */
export function frequencyLabel(f: ContractType['interest_frequency']): string {
  return i18n.t(`contract.frequency.${f}`);
}

/** A party's type, in the current language. */
export function partyLabel(type: PartyType['type']): string {
  return i18n.t(`contract.party.${type}`);
}

export function partyName(
  p: Pick<PartyType, 'organization_name' | 'last_name' | 'first_name'>,
): string {
  return (
    p.organization_name ?? [p.last_name, p.first_name].filter(Boolean).join(' ')
  );
}

/** The contract's number, or that it gets one once every party has signed. */
export function contractNumber(c: { contract_no?: string }): string {
  return c.contract_no ?? i18n.t('contract.unnumbered');
}

/** A timestamp as the contracts print dates, with the time: 2026-10-27 14:05. */
export function formatDateTime(value: string): string {
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
