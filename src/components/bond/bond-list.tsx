import { useQuery } from '@tanstack/react-query';
import { LandmarkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import { bondsOptions } from '@/queries/bond/options';
import type { SalesStatus } from '@/queries/bond/type';
import { BondCard } from './bond-card';

// Selling first, then the ones about to open, then the closed.
const order: SalesStatus[] = ['selling', 'upcoming', 'closed'];

/** The bonds on offer, one card each, the ones selling first. */
export function BondList() {
  const { t } = useTranslation();
  const { data, isPending, error } = useQuery(bondsOptions());

  if (error) {
    return <ApiErrorAlert error={toApiError(error)} />;
  }
  if (isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="hidden h-80 rounded-xl xl:block" />
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
          <LandmarkIcon className="size-8 text-muted-foreground" />
          <p className="font-medium">{t('bond.list.emptyTitle')}</p>
          <p className="text-sm text-muted-foreground">
            {t('bond.list.emptyText')}
          </p>
        </CardContent>
      </Card>
    );
  }
  const bonds = [...data].sort(
    (a, b) => order.indexOf(a.sales_status) - order.indexOf(b.sales_status),
  );
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {bonds.map((b) => (
        <BondCard key={b.id} bond={b} />
      ))}
    </div>
  );
}
