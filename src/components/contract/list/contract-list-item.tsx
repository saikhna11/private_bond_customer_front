import {
  ChevronRightIcon,
  DownloadIcon,
  FileTextIcon,
  PenLineIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ContractStatusBadge } from '@/components/contract/contract-status-badge';
import { contractNumber, formatAmount } from '@/components/contract/format';
import { Button } from '@/components/ui/button';
import type { ContractSummaryType } from '@/queries/contract/type';

/**
 * One contract in the list, opening its page; a signed one also downloads its PDF.
 * downloading says a download from the list is under way.
 */
export function ContractListItem({
  contract: c,
  onOpen,
  onDownload,
  downloading,
}: {
  contract: ContractSummaryType;
  onOpen: () => void;
  onDownload: () => void;
  downloading: boolean;
}) {
  const { t } = useTranslation();
  return (
    <li className="group flex items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/40">
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-4 text-left"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          <FileTextIcon className="size-5" />
        </span>
        <span className="min-w-0 flex-1 space-y-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">
              {c.contract_no ?? t('contract.bond', { name: c.contract_prefix })}
            </span>
            <ContractStatusBadge status={c.status} />
            {c.awaiting_signature && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <PenLineIcon className="size-3.5" />
                {t('contract.list.awaitingYou')}
              </span>
            )}
          </span>
          <span className="tabular block text-sm text-muted-foreground">
            {!c.contract_no && `${contractNumber(c)} · `}
            {formatAmount(c.principal_amount)} ₮ ·{' '}
            <span className="whitespace-nowrap">{c.contract_date}</span>
          </span>
        </span>
      </button>
      {c.status === 'signed' && (
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg"
          disabled={downloading}
          onClick={onDownload}
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
  );
}
