import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { ArrowRightIcon, ClockIcon, InfoIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { isIndividual } from '@/lib/client';
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
  const { t } = useTranslation();
  const { data: me } = useSuspenseQuery(meOptions());
  const { data: products, isPending, error } = useQuery(productsOptions());

  if (!isIndividual(me)) {
    return (
      <ProductNotice
        Icon={InfoIcon}
        className="border-dashed"
        title={t('contract.product.individualsOnlyTitle')}
        text={t('contract.product.individualsOnlyText')}
      />
    );
  }
  if (me.status !== 'approved') {
    return (
      <ProductNotice
        Icon={ClockIcon}
        className="border-warning/30 bg-warning/5"
        iconClassName="bg-warning/15 text-warning-foreground dark:text-warning"
        title={t('contract.product.notApprovedTitle')}
        text={t('contract.product.notApprovedText')}
        action={
          <Button asChild variant="outline" className="h-10 rounded-xl">
            <Link to="/profile">
              {t('contract.product.profile')}
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
