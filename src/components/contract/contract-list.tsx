import { useQuery } from '@tanstack/react-query';
import {
  ChevronRightIcon,
  DownloadIcon,
  FileTextIcon,
  PenLineIcon,
} from 'lucide-react';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { Button } from '@/components/ui/button';
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
import { ContractStatusBadge } from './contract-status-badge';
import { useDownloadContract } from './download';
import { contractNumber, formatAmount } from './format';

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
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <FileTextIcon className="size-6" />
              </span>
              <p className="font-semibold">Одоогоор гэрээ алга</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Дээрх бондуудаас сонгож анхны гэрээгээ байгуулна уу.
              </p>
            </div>
          </div>
        ) : (
          <ul className="divide-y">
            {contracts.map((c) => (
              <li
                key={c.id}
                className="group flex items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/40"
              >
                <button
                  type="button"
                  onClick={() => onOpen(c.id)}
                  className="flex min-w-0 flex-1 items-center gap-4 text-left"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <FileTextIcon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1 space-y-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">
                        {c.contract_no ?? `${c.contract_prefix} бонд`}
                      </span>
                      <ContractStatusBadge status={c.status} />
                      {c.awaiting_signature && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          <PenLineIcon className="size-3.5" />
                          Таны гарын үсэг хүлээгдэж байна
                        </span>
                      )}
                    </span>
                    <span className="tabular block text-sm text-muted-foreground">
                      {!c.contract_no && `${contractNumber(c)} · `}
                      {formatAmount(c.principal_amount)} ₮ ·{' '}
                      <span className="whitespace-nowrap">
                        {c.contract_date}
                      </span>
                    </span>
                  </span>
                </button>
                {c.status === 'signed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    disabled={download.isPending}
                    onClick={() => download.mutate(c)}
                  >
                    <DownloadIcon />
                    <span className="hidden sm:inline">PDF</span>
                  </Button>
                )}
                <ChevronRightIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
