import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RateOptionType } from "@/queries/bond/type";
import { frequencyText, percent } from "./format";

export function RateOptionTable({ options }: { options: RateOptionType[] }) {
  const { t } = useTranslation();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Хүүгийн нөхцөл</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {/* max-h-[400px] нь хүснэгтийн хамгийн их өндрийг тогтоож, дата хэтэрвэл скролл үүсгэнэ */}
        <div className="max-h-[400px] overflow-y-auto overflow-x-auto px-6 pb-6">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card z-10 shadow-sm shadow-background/50">
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-3 pr-4 font-medium">Хугацаа</th>
                <th className="py-3 pr-4 font-medium">Хүү төлөх</th>
                <th className="py-3 text-right font-medium">Жилийн хүү</th>
              </tr>
            </thead>
            <tbody>
              {options.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="tabular py-3 pr-4">
                    {o.term_min_months === o.term_max_months
                      ? t("contract.months", { count: o.term_min_months })
                      : t("bond.monthsRange", {
                          from: o.term_min_months,
                          to: o.term_max_months,
                        })}
                  </td>
                  <td className="py-3 pr-4">
                    {frequencyText(o.interest_frequency)}
                  </td>
                  <td className="tabular py-3 text-right font-semibold text-primary">
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
