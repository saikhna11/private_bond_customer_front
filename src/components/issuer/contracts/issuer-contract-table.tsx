import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type {
  IssuerContractSummaryType,
  IssuerContractView,
} from '@/queries/issuer/type';
import { issuerContractColumns } from './issuer-contract-columns';
import { IssuerContractRow } from './issuer-contract-row';

/**
 * A page of the issuer's contracts, a row each, under the column names on a wide screen.
 * dimmed says the next page is loading.
 */
export function IssuerContractTable({
  tab,
  contracts,
  dimmed,
  onOpen,
}: {
  tab: IssuerContractView;
  contracts: IssuerContractSummaryType[];
  dimmed: boolean;
  onOpen: (contractId: string) => void;
}) {
  const { t } = useTranslation();
  const columns = [
    'contractNo',
    'client',
    'bond',
    'amount',
    'term',
    'date',
    tab === 'pending' ? 'deadline' : 'status',
  ] as const;

  return (
    <div className={cn('transition-opacity', dimmed && 'opacity-60')}>
      <div
        aria-hidden="true"
        className={cn(
          'hidden gap-4 border-b px-6 pb-2 text-xs font-medium text-muted-foreground lg:grid',
          issuerContractColumns,
        )}
      >
        {columns.map((key) => (
          <span key={key} className={cn(key === 'amount' && 'text-right')}>
            {t(`issuer.contracts.columns.${key}`)}
          </span>
        ))}
      </div>
      <ul className="divide-y">
        {contracts.map((c) => (
          <li key={c.id}>
            <IssuerContractRow
              tab={tab}
              contract={c}
              onOpen={() => onOpen(c.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
