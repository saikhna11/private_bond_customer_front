import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RateOptionType } from '@/queries/bond/type';
import { frequencyText, percent } from './format';

/** A bond's rate options: the terms each runs, how often it pays, and its rate. */
export function RateOptionTable({ options }: { options: RateOptionType[] }) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('bond.options.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-2 pr-4 font-medium">{t('bond.term')}</th>
                <th className="py-2 pr-4 font-medium">{t('bond.frequency')}</th>
                <th className="py-2 text-right font-medium">
                  {t('bond.rate')}
                </th>
              </tr>
            </thead>
            <tbody>
              {options.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="tabular py-2.5 pr-4">
                    {o.term_min_months === o.term_max_months
                      ? t('contract.months', { count: o.term_min_months })
                      : t('bond.monthsRange', {
                          from: o.term_min_months,
                          to: o.term_max_months,
                        })}
                  </td>
                  <td className="py-2.5 pr-4">
                    {frequencyText(o.interest_frequency)}
                  </td>
                  <td className="tabular py-2.5 text-right font-semibold text-primary">
                    {percent(o.annual_rate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
