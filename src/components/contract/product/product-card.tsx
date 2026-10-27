import { ArrowRightIcon, LandmarkIcon } from 'lucide-react';
import { frequencyLabels } from '@/components/contract/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { BondProductType } from '@/queries/contract/type';

/** One bond on sale: its rate and terms, and the way to its contract. */
export function ProductCard({
  product: p,
  onPick,
}: {
  product: BondProductType;
  onPick: () => void;
}) {
  return (
    <Card className="group py-0 transition-all hover:-translate-y-px hover:border-primary/40 hover:shadow-sm motion-reduce:hover:translate-y-0">
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
            <LandmarkIcon className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{p.name} бонд</p>
            <p className="text-sm text-muted-foreground">Хувь хүн эзэмшинэ</p>
          </div>
          <div className="text-right">
            <p className="tabular text-2xl font-bold text-primary">
              {Number(p.annual_rate)}%
            </p>
            <p className="text-xs text-muted-foreground">жилийн хүү</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-muted/60 px-3 py-2">
            <dt className="text-xs text-muted-foreground">Хугацаа</dt>
            <dd className="tabular font-semibold">{p.term_months} сар</dd>
          </div>
          <div className="rounded-xl bg-muted/60 px-3 py-2">
            <dt className="text-xs text-muted-foreground">Хүү төлөх</dt>
            <dd className="font-semibold">
              {frequencyLabels[p.interest_frequency]}
            </dd>
          </div>
        </dl>
        <div className="mt-auto flex flex-col gap-2">
          <Button
            className="h-10 rounded-xl"
            disabled={!p.available}
            onClick={onPick}
          >
            Гэрээ байгуулах
            <ArrowRightIcon />
          </Button>
          {!p.available && (
            <p className="text-center text-xs text-muted-foreground">
              Энэ бондод гэрээний загвар хараахан оноогоогүй байна.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
