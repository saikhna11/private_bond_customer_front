import { useQuery } from '@tanstack/react-query';
import { InboxIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DayRangeFilter } from '@/components/common/filters/day-range-filter';
import { FilterBar } from '@/components/common/filters/filter-bar';
import { FilterSelect } from '@/components/common/filters/filter-select';
import { SearchInput } from '@/components/common/filters/search-input';
import { formatMoney } from '@/components/contract/format';
import { IssuerContractPagination } from '@/components/issuer/contracts/issuer-contract-pagination';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/format';
import { issuerBondsOptions } from '@/queries/issuer-bond/options';
import { IssuerBondStatus } from './issuer-bond-status';

import {
  type IssuerBondFilter,
  issuerBondViews,
  keeps,
} from './issuer-bond-view';

/** How many bonds a page of the list holds. */
const pageSize = 20;

/**
 * The issuer's bonds and requests, newest first, narrowed by filter (onFilter changes it); a
 * row opens the bond.
 */
export function IssuerBondList({
  filter,
  onFilter,
  onOpen,
}: {
  filter: IssuerBondFilter;
  onFilter: (patch: IssuerBondFilter) => void;
  onOpen: (id: string) => void;
}) {
  const { t } = useTranslation();
  const { data, isPending } = useQuery(issuerBondsOptions());
  const setQ = useCallback(
    (q: string) => onFilter({ q: q || undefined }),
    [onFilter],
  );
  if (isPending) return <Skeleton className="h-48 w-full rounded-xl" />;
  const all = data?.items ?? [];
  const matched = all.filter((b) => keeps(b, filter));
  const page = filter.page ?? 1;
  const items = matched.slice((page - 1) * pageSize, page * pageSize);
  if (all.length === 0) {
    return (
      <Card className="items-center gap-2 py-12 text-center">
        <InboxIcon className="size-6 text-muted-foreground" />
        <p className="max-w-sm text-sm text-muted-foreground">
          {t('issuer.bonds.empty')}
        </p>
      </Card>
    );
  }
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <FilterBar
        search={
          <SearchInput
            value={filter.q ?? ''}
            onChange={setQ}
            placeholder={t('issuer.bonds.search')}
          />
        }
      >
        <FilterSelect
          value={filter.status}
          onChange={(status) => onFilter({ status })}
          allLabel={t('issuer.bonds.allStatuses')}
          options={issuerBondViews.map((v) => ({
            value: v,
            label: t(`issuer.bonds.status.${v}`),
          }))}
        />
        <DayRangeFilter
          id="issuer-bonds-days"
          from={filter.from}
          to={filter.to}
          onChange={(range) => onFilter(range)}
        />
      </FilterBar>
      {matched.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted-foreground">
          {t('issuer.bonds.noMatch')}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="pl-4">
                {t('issuer.bonds.columns.code')}
              </TableHead>
              <TableHead>{t('issuer.bonds.columns.name')}</TableHead>
              <TableHead className="text-right">
                {t('issuer.bonds.columns.amount')}
              </TableHead>
              <TableHead className="text-right">
                {t('issuer.bonds.columns.sold')}
              </TableHead>
              <TableHead>{t('issuer.bonds.columns.sale')}</TableHead>
              <TableHead className="pr-4">
                {t('issuer.bonds.columns.status')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((b) => (
              <TableRow
                key={b.id}
                className="cursor-pointer"
                onClick={() => onOpen(b.id)}
              >
                <TableCell className="pl-4">
                  <span className="inline-flex rounded-md bg-muted px-2 py-1 font-mono text-sm font-medium">
                    {b.code}
                  </span>
                </TableCell>
                <TableCell>
                  <p className="max-w-64 truncate font-medium">{b.name}</p>
                </TableCell>
                <TableCell className="tabular-nums text-right">
                  {formatMoney(b.total_amount, b.currency)}
                </TableCell>
                <TableCell className="tabular-nums text-right text-muted-foreground">
                  {formatMoney(b.sold, b.currency)}
                </TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {formatDate(b.sale_start)} -{' '}
                  {b.sale_end
                    ? formatDate(b.sale_end)
                    : t('issuer.bonds.openEnded')}
                </TableCell>
                <TableCell className="pr-4">
                  <IssuerBondStatus b={b} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {matched.length > 0 && (
        <div className="pb-4">
          <IssuerContractPagination
            page={page}
            size={pageSize}
            total={matched.length}
            onPage={(next) => onFilter({ page: next })}
          />
        </div>
      )}
    </Card>
  );
}
