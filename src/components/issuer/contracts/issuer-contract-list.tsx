import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { DayRangeFilter } from '@/components/common/filters/day-range-filter';
import { FilterBar } from '@/components/common/filters/filter-bar';
import { FilterSelect } from '@/components/common/filters/filter-select';
import { SearchInput } from '@/components/common/filters/search-input';
import { ContractListEmpty } from '@/components/contract/list/contract-list-empty';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import { issuerContractsOptions } from '@/queries/issuer/options';
import {
  type IssuerContractView,
  issuerContractViewSchema,
} from '@/queries/issuer/type';
import { IssuerContractPagination } from './issuer-contract-pagination';
import { IssuerContractTable } from './issuer-contract-table';
import { issuerContractsRoute } from './route';

/**
 * The issuer's contracts, all of them or one tab's, picked from a select,
 * narrowed by a search and the days they were made, and a page at a time. All of it lives in
 * the URL, so the way back from a contract returns to it.
 */
export function IssuerContractList({
  onOpen,
}: {
  onOpen: (contractId: string) => void;
}) {
  const { t } = useTranslation();
  const {
    tab = 'pending',
    page = 1,
    q,
    from,
    to,
  } = issuerContractsRoute.useSearch();
  const navigate = issuerContractsRoute.useNavigate();
  const { data, isPending, isPlaceholderData, error } = useQuery(
    issuerContractsOptions(tab, page, { q, from, to }),
  );
  const setFilter = useCallback(
    (patch: {
      tab?: IssuerContractView;
      q?: string;
      from?: string;
      to?: string;
    }) =>
      navigate({ search: (prev) => ({ ...prev, ...patch, page: undefined }) }),
    [navigate],
  );
  const setQ = useCallback(
    (next: string) => setFilter({ q: next || undefined }),
    [setFilter],
  );

  return (
    <Card className="gap-0 py-0">
      <FilterBar
        search={
          <SearchInput
            value={q ?? ''}
            onChange={setQ}
            placeholder={t('issuer.contracts.search')}
          />
        }
      >
        <FilterSelect
          value={tab}
          onChange={(next) => setFilter({ tab: next ?? 'pending' })}
          options={issuerContractViewSchema.options.map((key) => ({
            value: key,
            label: t(`issuer.contracts.tabs.${key}`),
          }))}
        />
        <DayRangeFilter
          id="issuer-contracts-days"
          from={from}
          to={to}
          onChange={(range) => setFilter(range)}
        />
      </FilterBar>
      <CardContent className="px-0 py-4">
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
        {data && data.total > 0 && (
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
