import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import { bondOptions } from '@/queries/bond/options';
import { BackLink } from './back-link';
import { BondFacts } from './bond-facts';
import { BondHeader } from './bond-header';
import { ProspectusSection } from './prospectus/prospectus-section';
import { RateOptionTable } from './rate-option-table';

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

          {/* ЭНД ЗАССАН: grid-ийг flex flex-col болгож, картуудыг доошоо байрлуулав */}
          <div className="flex flex-col gap-6">
            <BondFacts bond={bond} />
            <RateOptionTable options={bond.rate_options} />
          </div>

          <ProspectusSection bond={bond} />
        </>
      )}
    </div>
  );
}
