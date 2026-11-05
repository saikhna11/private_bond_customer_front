import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { PageTitle } from '@/components/common/page-title';
import { Steps } from '@/components/contract/steps';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import { bondOptions } from '@/queries/bond/options';
import type { BondType } from '@/queries/bond/type';
import { BackLink } from './back-link';
import { BuyForm } from './buy/buy-form';
import { useBuyBlock } from './use-buy-block';

/**
 * Buying one bond, the first step of a contract: pick and pay, then read and sign it on the
 * contract's page.
 */
export function BondBuy({ bondId }: { bondId: string }) {
  const { t } = useTranslation();
  const { data: bond, isPending, error } = useQuery(bondOptions(bondId));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <BackLink
        to="/bonds/$bondId"
        params={{ bondId }}
        label={bond?.name ?? t('bond.list.title')}
      />
      {error ? (
        <ApiErrorAlert error={toApiError(error)} />
      ) : isPending ? (
        <Skeleton className="h-72 rounded-xl" />
      ) : (
        <>
          <PageTitle
            title={t('bond.buy.title', { name: bond.name })}
            description={t('bond.buy.description')}
          />
          <Card className="py-0">
            <CardContent className="px-4 py-5 sm:px-6">
              <Steps current="create" />
            </CardContent>
          </Card>
          <BuyOrBlock bond={bond} />
        </>
      )}
    </div>
  );
}

/** The form, or why the client cannot buy the bond now. */
function BuyOrBlock({ bond }: { bond: BondType }) {
  return useBuyBlock(bond) ?? <BuyForm bond={bond} />;
}
