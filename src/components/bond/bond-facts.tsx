import { ShieldCheckIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import type { BondType } from "@/queries/bond/type";
import { formatMoney } from "./format";

export function BondFacts({ bond }: { bond: BondType }) {
  const { t } = useTranslation();
  const money = (v: string) => formatMoney(v, bond.currency);
  const unit = Number(bond.purchase_unit);
  const pieces = (v: string) =>
    t("bond.facts.pieces", { count: Math.floor(Number(v) / unit) });

  const facts: { label: string; value: string; hint?: string }[] = [
    { label: t("bond.facts.unit"), value: money(bond.purchase_unit) },
    {
      label: t("bond.facts.minPurchase"),
      value: pieces(bond.min_purchase),
      hint: money(bond.min_purchase),
    },
    {
      label: t("bond.facts.total"),
      value: money(bond.total_amount),
      hint: pieces(bond.total_amount),
    },
    {
      label: t("bond.facts.remaining"),
      value: money(bond.remaining),
      hint: pieces(bond.remaining),
    },
    {
      label: t("bond.facts.cap"),
      value: bond.investor_cap
        ? pieces(bond.investor_cap)
        : t("bond.facts.noCap"),
      hint: bond.investor_cap ? money(bond.investor_cap) : undefined,
    },
    {
      label: t("bond.facts.sale"),
      value: bond.sale_end
        ? `${formatDate(bond.sale_start)} - ${formatDate(bond.sale_end)}`
        : t("bond.facts.saleOpen", { from: formatDate(bond.sale_start) }),
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("bond.facts.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Хайрцагуудын зайг бага зэрэг нэмэгдүүлж (gap-4), цэгцэлсэн */}
        <dl className="grid gap-4 sm:grid-cols-2">
          {facts.map((f) => (
            <div
              key={f.label}
              // flex-col justify-between нь тайлбар байхгүй үед ч хайрцгийг тэгшхэн байлгана
              className="flex flex-col justify-between rounded-xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50"
            >
              <div>
                <dt className="text-[13px] font-medium text-muted-foreground mb-1">
                  {f.label}
                </dt>
                <dd className="tabular text-lg font-semibold tracking-tight">
                  {f.value}
                </dd>
              </div>
              {f.hint && (
                <dd className="tabular mt-2 text-xs font-medium text-muted-foreground/70">
                  {f.hint}
                </dd>
              )}
            </div>
          ))}
        </dl>

        {/* Баталгаажсан тэмдгийг илүү гоёмсог Badge болгосон */}
        {bond.has_guarantee && (
          <div className="pt-2">
            <p className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
              <ShieldCheckIcon className="size-4" />
              {t("bond.facts.guarantee")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
