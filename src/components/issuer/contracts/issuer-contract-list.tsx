import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { ContractListEmpty } from '@/components/contract/list/contract-list-empty';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import { issuerContractsOptions } from '@/queries/issuer/options';
import { IssuerContractPagination } from './issuer-contract-pagination';
import { IssuerContractTable } from './issuer-contract-table';
import { IssuerContractTabs } from './issuer-contract-tabs';
import { issuerContractsRoute } from './route';

/**
 * The issuer's contracts, one tab at a time with every tab's count, and a page at a time.
 * The tab and page live in the URL, so the way back from a contract returns to them.
 */
export function IssuerContractList({
  onOpen,
}: {
  onOpen: (contractId: string) => void;
}) {
  const { t } = useTranslation();
  const { tab = 'pending', page = 1 } = issuerContractsRoute.useSearch();
  const navigate = issuerContractsRoute.useNavigate();
  const { data, isPending, isPlaceholderData, error } = useQuery(
    issuerContractsOptions(tab, page),
  );

  return (
    <Card>
      <CardHeader>
        <IssuerContractTabs
          tab={tab}
          counts={data?.counts}
          onChange={(next) => navigate({ search: { tab: next } })}
        />
      </CardHeader>
      <CardContent className="px-0">
        {isPending ? (
          <div className="space-y-3 px-6">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : error ? (
          <div className="px-6">
            <ApiErrorAlert error={toApiError(error)} />
          </div>
        ) : data.items.length === 0 ? (
          <div className="px-6">
            <ContractListEmpty text={t(`issuer.contracts.empty.${tab}`)} />
          </div>
        ) : (
          <IssuerContractTable
            tab={tab}
            contracts={data.items}
            dimmed={isPlaceholderData}
            onOpen={onOpen}
          />
        )}
        {data && (data.total > data.size || page > 1) && (
          <IssuerContractPagination
            page={page}
            size={data.size}
            total={data.total}
            onPage={(next) =>
              navigate({ search: (prev) => ({ ...prev, page: next }) })
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
