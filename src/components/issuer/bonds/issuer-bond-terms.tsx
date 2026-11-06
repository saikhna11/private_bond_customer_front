import { useTranslation } from 'react-i18next';
import { formatMoney } from '@/components/contract/format';
import { formatDate } from '@/lib/format';
import type { IssuerBondDetailType } from '@/queries/issuer-bond/type';

/** A bond's terms as the request sent them or staff edited them. */
export function IssuerBondTerms({ b }: { b: IssuerBondDetailType }) {
  const { t } = useTranslation();
  const money = (v: string) => formatMoney(v, b.currency);
  const rows: [string, string][] = [
    [t('issuer.bonds.form.currency'), b.currency],
    [t('issuer.bonds.form.purchaseUnit'), money(b.purchase_unit)],
    [t('issuer.bonds.form.minPurchase'), money(b.min_purchase)],
    [
      t('issuer.bonds.form.investorCap'),
      b.investor_cap ? money(b.investor_cap) : t('issuer.bonds.unlimited'),
    ],
    [t('issuer.bonds.form.totalAmount'), money(b.total_amount)],
    [t('issuer.bonds.form.saleStart'), formatDate(b.sale_start)],
    [
      t('issuer.bonds.form.saleEnd'),
      b.sale_end ? formatDate(b.sale_end) : t('issuer.bonds.openEnded'),
    ],
    [
      t('issuer.bonds.form.method'),
      t(`issuer.bonds.method.${b.interest_method}`),
    ],
    [t('issuer.bonds.form.cutoff'), b.issuer_cutoff],
    [t('issuer.bonds.form.exitFee'), `${b.exit_fee_rate}%`],
    [t('issuer.bonds.form.penalty'), `${b.penalty_rate}%`],
    [
      t('issuer.bonds.form.guarantee'),
      b.has_guarantee ? t('issuer.bonds.yes') : t('issuer.bonds.no'),
    ],
  ];
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="tabular-nums truncate text-sm font-medium">{value}</dd>
        </div>
      ))}
      {b.prospectus && (
        <div className="sm:col-span-2 lg:col-span-3">
          <dt className="text-xs text-muted-foreground">
            {t('issuer.bonds.form.prospectus')}
          </dt>
          <dd className="text-sm whitespace-pre-line">{b.prospectus}</dd>
        </div>
      )}
    </dl>
  );
}
