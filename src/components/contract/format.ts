import type { ContractType, PartyType } from '@/queries/contract/type';

const amountFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** A decimal string as the contract prints it: 1,000,000.00. */
export function formatAmount(value: string): string {
  return amountFormat.format(Number(value));
}

export const frequencyLabels: Record<
  ContractType['interest_frequency'],
  string
> = {
  monthly: 'Сар бүр',
  quarterly: 'Улирал тутам',
  semi_annual: 'Хагас жил тутам',
  annual: 'Жил бүр',
  at_maturity: 'Хугацааны эцэст',
};

export const partyLabels: Record<PartyType['type'], string> = {
  holder: 'Худалдан авагч',
  co_holder: 'Хамтран эзэмшигч',
  organization: 'Байгууллага',
  guardian: 'Асран хамгаалагч',
  minor: 'Насанд хүрээгүй эзэмшигч',
};

export function partyName(
  p: Pick<PartyType, 'organization_name' | 'last_name' | 'first_name'>,
): string {
  return (
    p.organization_name ?? [p.last_name, p.first_name].filter(Boolean).join(' ')
  );
}

/** The contract's number, or that it gets one once every party has signed. */
export function contractNumber(c: { contract_no?: string }): string {
  return c.contract_no ?? 'Дугаар олгогдоогүй';
}

/** A timestamp as the contracts print dates, with the time: 2026-10-27 14:05. */
export function formatDateTime(value: string): string {
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
