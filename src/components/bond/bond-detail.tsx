import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import { bondOptions } from '@/queries/bond/options';
import { BackLink } from './back-link';
import { BondFacts } from './bond-facts';
import { BondHeader } from './bond-header';
import { ProspectusViewer } from './prospectus/prospectus-viewer';
import { RateOptionTable } from './rate-option-table';

/** One bond as a buyer reads it before buying: its terms, options and prospectus. */
export function BondDetail({ bondId }: { bondId: string }) {
  const { t } = useTranslation();
  const { data: bond, isPending, error } = useQuery(bondOptions(bondId));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <BackLink to="/bonds" label={t('bond.list.title')} />
      {error ? (
        <ApiErrorAlert error={toApiError(error)} />
      ) : isPending ? (
        <Skeleton className="h-72 rounded-xl" />
      ) : (
        <>
          <BondHeader bond={bond} />
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <RateOptionTable options={bond.rate_options} />
            <BondFacts bond={bond} />
          </div>
          {bond.prospectus && (
            <Card>
              <CardHeader>
                <CardTitle>{t('bond.about')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">{bond.prospectus}</p>
              </CardContent>
            </Card>
          )}
          <ProspectusViewer bond={bond} />
        </>
      )}
    </div>
  );
}
