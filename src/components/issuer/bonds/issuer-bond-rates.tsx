import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { IssuerBondDetailType } from '@/queries/issuer-bond/type';

/** A bond's rate matrix: each option's frequency, range of terms and annual rate. */
export function IssuerBondRates({ b }: { b: IssuerBondDetailType }) {
  const { t } = useTranslation();
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="pl-4">
              {t('issuer.bonds.form.frequency')}
            </TableHead>
            <TableHead>{t('issuer.bonds.form.terms')}</TableHead>
            <TableHead className="pr-4 text-right">
              {t('issuer.bonds.form.annualRate')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {b.rate_options.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="pl-4">
                {t(`contract.frequency.${o.interest_frequency}`)}
              </TableCell>
              <TableCell className="tabular-nums">
                {o.term_min_months === o.term_max_months
                  ? t('issuer.bonds.form.months', { count: o.term_min_months })
                  : `${o.term_min_months}-${t('issuer.bonds.form.months', { count: o.term_max_months })}`}
              </TableCell>
              <TableCell className="tabular-nums pr-4 text-right">
                {o.annual_rate}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
