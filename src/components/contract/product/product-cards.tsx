import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowRightIcon, ClockIcon, InfoIcon } from 'lucide-react';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import { meOptions } from '@/queries/auth/options';
import { productsOptions } from '@/queries/contract/options';
import type { Product } from '@/queries/contract/type';
import { ProductCard } from './product-card';
import { ProductNotice } from './product-notice';

/**
 * The sample bonds a holder can buy, one card each, opening its contract's preview.
 * Nothing is stored until the holder signs it; the backend fills it from the bond's sample
 * order and the client's profile, so the user enters nothing. Only an approved customer
 * buys: the templates name a Mongolian citizen.
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
      <ProductNotice
        Icon={InfoIcon}
        className="border-dashed"
        title="Одоогоор зөвхөн Монгол Улсын иргэнд"
        text="Бонд худалдан авах гэрээ одоогоор зөвхөн Монгол Улсын иргэнд нээлттэй."
      />
    );
  }
  if (me.status !== 'approved') {
    return (
      <ProductNotice
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
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.name} product={p} onPick={() => onPick(p.name)} />
      ))}
    </div>
  );
}
