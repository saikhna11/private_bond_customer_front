import { useQuery } from '@tanstack/react-query';
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
import { ContractListEmpty } from './contract-list-empty';
import { ContractListItem } from './contract-list-item';

/**
 * The client's contracts, newest first, each opening its status and PDF. One waiting for
 * the client's own signature says so: they sign it from its page.
 */
export function ContractList({
  onOpen,
}: {
  onOpen: (contractId: string) => void;
}) {
  const { data: contracts, isPending, error } = useQuery(contractsOptions());
  const download = useDownloadContract();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Миний гэрээнүүд</CardTitle>
        <CardDescription>
          {contracts
            ? `${contracts.length} гэрээ`
            : 'Гэрээнүүдийг ачаалж байна...'}
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
          <ul className="divide-y">
            {contracts.map((c) => (
              <ContractListItem
                key={c.id}
                contract={c}
                onOpen={() => onOpen(c.id)}
                onDownload={() => download.mutate(c)}
                downloading={download.isPending}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
