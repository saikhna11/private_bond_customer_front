import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { useDownloadContract } from '@/components/contract/download';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import { contractsOptions } from '@/queries/contract/options';
import { ContractGroup } from './contract-group';
import { ContractListEmpty } from './contract-list-empty';

/**
 * The client's contracts, newest first, each opening its status and PDF. Those waiting for
 * the client's own signature, such as one a co-holder names them in, come first under
 * their own title: they sign them from their pages.
 */
export function ContractList({
  onOpen,
}: {
  onOpen: (contractId: string) => void;
}) {
  const { t } = useTranslation();
  const { data: contracts, isPending, error } = useQuery(contractsOptions());
  const download = useDownloadContract();
  const awaiting = contracts?.filter((c) => c.awaiting_signature) ?? [];
  const others = contracts?.filter((c) => !c.awaiting_signature) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('contract.list.title')}</CardTitle>
        <CardDescription>
          {contracts
            ? t('contract.list.count', { count: contracts.length })
            : t('contract.list.loading')}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {isPending ? (
          <div className="space-y-3 px-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : error ? (
          <div className="px-6">
            <ApiErrorAlert error={toApiError(error)} />
          </div>
        ) : contracts.length === 0 ? (
          <div className="px-6">
            <ContractListEmpty />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {awaiting.length > 0 && (
              <ContractGroup
                title={t('contract.list.awaitingTitle', {
                  count: awaiting.length,
                })}
                contracts={awaiting}
                onOpen={onOpen}
                onDownload={download.mutate}
                downloading={download.isPending}
              />
            )}
            {others.length > 0 && (
              <ContractGroup
                title={
                  awaiting.length > 0
                    ? t('contract.list.othersTitle')
                    : undefined
                }
                contracts={others}
                onOpen={onOpen}
                onDownload={download.mutate}
                downloading={download.isPending}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
