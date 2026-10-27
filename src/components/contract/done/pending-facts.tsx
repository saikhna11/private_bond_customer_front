import { useTranslation } from 'react-i18next';
import { ContractStatusBadge } from '@/components/contract/contract-status-badge';
import {
  contractNumber,
  formatAmount,
  formatDateTime,
} from '@/components/contract/format';
import type { ContractType } from '@/queries/contract/type';

/** A pending contract's number, amount and status, and the deadline for its signatures. */
export function PendingFacts({ contract }: { contract: ContractType }) {
  const { t } = useTranslation();
  const { status } = contract;

  return (
    <dl className="grid w-full max-w-md grid-cols-2 gap-3 text-left text-sm">
      <div className="rounded-xl bg-muted/60 px-3 py-2">
        <dt className="text-xs text-muted-foreground">
          {t('contract.facts.contractNo')}
        </dt>
        <dd className="font-semibold">{contractNumber(contract)}</dd>
      </div>
      <div className="rounded-xl bg-muted/60 px-3 py-2">
        <dt className="text-xs text-muted-foreground">
          {t('contract.facts.amount')}
        </dt>
        <dd className="tabular font-semibold">
          {formatAmount(contract.principal_amount)} ₮
        </dd>
      </div>
      <div className="col-span-2 flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
        <dt className="text-xs text-muted-foreground">
          {t('contract.facts.status')}
        </dt>
        <dd>
          <ContractStatusBadge status={status} />
        </dd>
      </div>
      {status === 'pending_signature' && contract.signature_deadline && (
        <div className="col-span-2 flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
          <dt className="text-xs text-muted-foreground">
            {t('contract.facts.deadline')}
          </dt>
          <dd className="tabular font-semibold">
            {formatDateTime(contract.signature_deadline)}
          </dd>
        </div>
      )}
    </dl>
  );
}
