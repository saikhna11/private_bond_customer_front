import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { DocxView } from '@/components/contract/preview/docx-view';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import { useContractApi } from '@/queries/contract/api';
import { contractPreviewOptions } from '@/queries/contract/options';

/**
 * A contract awaiting the director, as it reads now: filled in the browser with its client
 * parties' signatures in place and the director's still blank.
 */
export function IssuerPreviewCard({ contractId }: { contractId: string }) {
  const { t } = useTranslation();
  const {
    data: preview,
    isPending,
    error,
  } = useQuery(contractPreviewOptions(contractId, useContractApi()));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('issuer.contracts.document.title')}</CardTitle>
        <CardDescription>
          {t('issuer.contracts.document.pending')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-[60vh] w-full rounded-xl" />
        ) : error ? (
          <ApiErrorAlert error={toApiError(error)} />
        ) : (
          <DocxView preview={preview} />
        )}
      </CardContent>
    </Card>
  );
}
