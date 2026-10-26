import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import {
  ArrowRightIcon,
  ClockIcon,
  InfoIcon,
  LandmarkIcon,
  UsersRoundIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import { cn } from '@/lib/utils';
import { meOptions } from '@/queries/auth/options';
import { productsOptions } from '@/queries/contract/options';
import type { BondProductType, Product } from '@/queries/contract/type';
import { frequencyLabels } from './format';

/**
 * The sample bonds a holder can buy, one card each, opening its contract's preview.
 * Nothing is stored until the holder signs it; the backend fills it from the bond's sample
 * order and the client's profile, so the user enters nothing but a co-holder, for a bond
 * with one. Only an approved customer buys: the templates name a Mongolian citizen.
 */
export function ProductCards({
  onPick,
}: {
  onPick: (product: Product) => void;
}) {
  const { data: me } = useSuspenseQuery(meOptions());
  const { data: products, isPending, error } = useQuery(productsOptions());

  if (me.type !== 'customer') {
    return (
      <Notice
        Icon={InfoIcon}
        className="border-dashed"
        title="Одоогоор зөвхөн Монгол Улсын иргэнд"
        text="Бонд худалдан авах гэрээ одоогоор зөвхөн Монгол Улсын иргэнд нээлттэй."
      />
    );
  }
  if (me.status !== 'approved') {
    return (
      <Notice
        Icon={ClockIcon}
        className="border-warning/30 bg-warning/5"
        iconClassName="bg-warning/15 text-warning-foreground dark:text-warning"
        title="Бүртгэл баталгаажаагүй байна"
        text="Бүртгэл тань баталгаажсаны дараа бонд худалдан авч, гэрээ байгуулах боломжтой."
        action={
          <Button asChild variant="outline" className="h-10 rounded-xl">
            <Link to="/profile">
              Профайл
              <ArrowRightIcon />
            </Link>
          </Button>
        }
      />
    );
  }
  if (error) {
    return <ApiErrorAlert error={toApiError(error)} />;
  }
  if (isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {products.map((p) => (
        <ProductCard key={p.name} product={p} onPick={() => onPick(p.name)} />
      ))}
    </div>
  );
}

function ProductCard({
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
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              {p.co_holder && <UsersRoundIcon className="size-3.5" />}
              {p.co_holder ? 'Хамтран эзэмшигчтэй' : 'Хувь хүн эзэмшинэ'}
            </p>
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

function Notice({
  Icon,
  title,
  text,
  action,
  className,
  iconClassName = 'bg-muted text-muted-foreground',
}: {
  Icon: typeof InfoIcon;
  title: string;
  text: string;
  action?: ReactNode;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <span
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-full',
            iconClassName,
          )}
        >
          <Icon className="size-6" />
        </span>
        <div className="flex-1 space-y-1">
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{text}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
