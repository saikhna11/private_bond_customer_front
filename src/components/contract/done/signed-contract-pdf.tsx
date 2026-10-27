import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';
import { contractDocumentOptions } from '@/queries/contract/options';
import { usePdfPages } from './use-pdf-pages';

/**
 * A signed contract's PDF, page by page (usePdfPages). The download shares its fetch
 * (contractDocumentOptions).
 */
export function SignedContractPdf({ contractId }: { contractId: string }) {
  const { data, isPending, error } = useQuery(
    contractDocumentOptions(contractId),
  );
  const { pages, ready, failed } = usePdfPages(data);

  if (error || failed) {
    return (
      <p className="py-10 text-center text-sm text-destructive">
        {error
          ? apiErrorMessage(toApiError(error))
          : 'Гэрээг харуулж чадсангүй. PDF татаж аваад үзнэ үү.'}
      </p>
    );
  }
  return (
    <div
      aria-busy={!ready}
      className="max-h-[75vh] overflow-y-auto rounded-xl border bg-muted p-2 [scrollbar-gutter:stable] sm:p-4"
    >
      {(isPending || !ready) && <Skeleton className="h-[60vh] w-full" />}
      <div ref={pages} className="flex flex-col gap-3" />
    </div>
  );
}
