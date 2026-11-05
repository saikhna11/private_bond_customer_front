import { useTranslation } from 'react-i18next';
import { ContractStatusBadge } from '@/components/contract/contract-status-badge';
import { contractNumber, formatMoney } from '@/components/contract/format';
import { cn } from '@/lib/utils';
import type {
  IssuerContractSummaryType,
  IssuerContractTab,
} from '@/queries/issuer/type';
import { DeadlineLeft } from './deadline-left';
import { issuerContractColumns } from './issuer-contract-columns';
import { personName } from './person-name';

/**
 * One of the issuer's contracts in the list, opening it: its number, its client, bond,
 * amount, term and date, and its deadline in the pending tab or its status in the others. A
 * narrow screen stacks them.
 */
export function IssuerContractRow({
  tab,
  contract: c,
  onOpen,
}: {
  tab: IssuerContractTab;
  contract: IssuerContractSummaryType;
  onOpen: () => void;
}) {
  const { t } = useTranslation();
  const amount = formatMoney(c.principal_amount, c.currency);
  const term = t('contract.months', { count: c.term_months });
  const end =
    tab === 'pending' ? (
      <DeadlineLeft deadline={c.signature_deadline} />
    ) : (
      <ContractStatusBadge status={c.status} />
    );

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'w-full px-6 py-3 text-left text-sm transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none lg:grid lg:items-center lg:gap-4',
        issuerContractColumns,
      )}
    >
      <span className="flex items-start justify-between gap-3 lg:block">
        <span className="font-semibold">{contractNumber(c)}</span>
        <span className="shrink-0 lg:hidden">{end}</span>
      </span>
      <span className="mt-1 block min-w-0 lg:mt-0">
        <span className="block truncate font-medium">
          {personName(c.holder)}
        </span>
        {c.co_holder && (
          <span className="block truncate text-xs text-muted-foreground">
            {t('issuer.contracts.withCoHolder', {
              name: personName(c.co_holder),
            })}
          </span>
        )}
      </span>
      <span className="hidden min-w-0 lg:block">
        <span className="block truncate">{c.bond_name}</span>
        <span className="block text-xs text-muted-foreground">
          {c.contract_prefix}
        </span>
      </span>
      <span className="tabular hidden text-right font-medium whitespace-nowrap lg:block">
        {amount}
      </span>
      <span className="hidden whitespace-nowrap lg:block">{term}</span>
      <span className="tabular hidden whitespace-nowrap lg:block">
        {c.contract_date}
      </span>
      <span className="hidden lg:block">{end}</span>
      <span className="tabular mt-1 block text-xs text-muted-foreground lg:hidden">
        {[c.bond_name, amount, term, c.contract_date].join(' · ')}
      </span>
    </button>
  );
}
