import { useTranslation } from 'react-i18next';
import { DeclineReason } from '@/components/contract/done/decline-reason';
import { RefundNote } from '@/components/contract/done/refund-note';
import { Card, CardContent } from '@/components/ui/card';
import type { ContractType } from '@/queries/contract/type';
import { IssuerContractActions } from './issuer-contract-actions';
import { issuerStateCopy } from './issuer-state-copy';
import { IssuerStateIcon } from './issuer-state-icon';

/**
 * Where one of the issuer's contracts stands, with the director's reason and the refund of a
 * paid one that ended, and what the reader can do with it (IssuerContractActions). slow says
 * the page gave up polling for its PDF.
 */
export function IssuerContractState({
  contract,
  slow,
  checking,
  onCheckAgain,
  onSign,
}: {
  contract: ContractType;
  slow: boolean;
  checking: boolean;
  onCheckAgain: () => void;
  onSign: () => void;
}) {
  const { t } = useTranslation();
  const { title, message } = issuerStateCopy(t, contract, slow);
  const ended =
    contract.status === 'cancelled' || contract.status === 'expired';

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <IssuerStateIcon status={contract.status} slow={slow} />
          <div className="min-w-0 space-y-3">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
            {contract.decline_reason && (
              <DeclineReason
                reason={contract.decline_reason}
                className="max-w-xl"
              />
            )}
            {ended && contract.paid_on && (
              <RefundNote
                text={t('issuer.contracts.state.refund')}
                className="max-w-xl"
              />
            )}
          </div>
        </div>
        <IssuerContractActions
          contract={contract}
          slow={slow}
          checking={checking}
          onCheckAgain={onCheckAgain}
          onSign={onSign}
        />
      </CardContent>
    </Card>
  );
}
