import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import type { ContractType } from '@/queries/contract/type';
import { DeclineReason } from './decline-reason';
import { PartyStatuses } from './party-statuses';
import { PendingActions } from './pending-actions';
import { pendingCopy } from './pending-copy';
import { PendingFacts } from './pending-facts';
import { PendingStatusIcon } from './pending-status-icon';
import { RefundNote } from './refund-note';

/**
 * A contract not signed yet, or cancelled: why it waits or ended, with the director's reason
 * and the refund of a paid one, its terms, whose signatures it waits for, and what the client
 * can do. slow says the page gave up polling for its PDF.
 */
export function PendingContract({
  contract,
  slow,
  checking,
  onCheckAgain,
  onList,
}: {
  contract: ContractType;
  slow: boolean;
  checking: boolean;
  onCheckAgain: () => void;
  onList: () => void;
}) {
  const { t } = useTranslation();
  const { title, message } = pendingCopy(t, contract, slow);
  const ended =
    contract.status === 'cancelled' || contract.status === 'expired';

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-6 py-6 text-center">
        <PendingStatusIcon status={contract.status} slow={slow} />
        <div className="max-w-md space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        {contract.decline_reason && (
          <DeclineReason reason={contract.decline_reason} />
        )}
        {ended && contract.paid_on && (
          <RefundNote text={t('contract.pending.refund')} />
        )}
        <PendingFacts contract={contract} />
        <PartyStatuses contract={contract} />
        <PendingActions
          contract={contract}
          slow={slow}
          checking={checking}
          onCheckAgain={onCheckAgain}
          onList={onList}
        />
      </CardContent>
    </Card>
  );
}
