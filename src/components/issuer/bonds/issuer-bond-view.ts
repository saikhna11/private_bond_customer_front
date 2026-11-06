import type { IssuerBondType } from '@/queries/issuer-bond/type';

/** Where a bond stands as the issuer reads it: a draft request is being reviewed. */
export const issuerBondViews = [
  'reviewing',
  'draft',
  'upcoming',
  'selling',
  'paused',
  'closed',
  'rejected',
] as const;
export type IssuerBondView = (typeof issuerBondViews)[number];

export function issuerBondView(b: IssuerBondType): IssuerBondView {
  return b.sales_status === 'draft' && b.requested_at
    ? 'reviewing'
    : b.sales_status;
}

/** What narrows the issuer's bonds: code or name, where it stands, the days it was made; page. */
export interface IssuerBondFilter {
  page?: number;
  q?: string;
  status?: IssuerBondView;
  from?: string;
  to?: string;
}

/** The day b was made in Ulaanbaatar, YYYY-MM-DD, as the day filters read days. */
function madeOn(b: IssuerBondType): string {
  return new Date(b.created_at).toLocaleDateString('en-CA', {
    timeZone: 'Asia/Ulaanbaatar',
  });
}

/** Whether f keeps b; the list is the issuer's own, a handful of bonds, so it filters here. */
export function keeps(b: IssuerBondType, f: IssuerBondFilter): boolean {
  const q = f.q?.trim().toLowerCase();
  return (
    (!q ||
      b.code.toLowerCase().includes(q) ||
      b.name.toLowerCase().includes(q)) &&
    (!f.status || issuerBondView(b) === f.status) &&
    (!f.from || madeOn(b) >= f.from) &&
    (!f.to || madeOn(b) <= f.to)
  );
}
