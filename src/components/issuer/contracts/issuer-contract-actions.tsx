import {
  DownloadIcon,
  InfoIcon,
  PenLineIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDownloadContract } from '@/components/contract/download';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ContractType } from '@/queries/contract/type';
import { hoursLeft } from './deadline';
import { IssuerDeclineDialog } from './issuer-decline-dialog';

/**
 * What the reader can do with one of the issuer's contracts. While it awaits the director,
 * they sign or decline it, and any other member reads that the director does; a signed one
 * downloads its PDF; one whose PDF is slow checks again.
 */
export function IssuerContractActions({
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
  const download = useDownloadContract();

  if (contract.status === 'pending_issuer_signature') {
    if (contract.your_party_id) {
      return (
        <div className="flex shrink-0 flex-col-reverse gap-3 sm:flex-row">
          <IssuerDeclineDialog contractId={contract.id} />
          <Button className="h-10 rounded-xl px-6" onClick={onSign}>
            <PenLineIcon />
            {t('issuer.contracts.actions.sign')}
          </Button>
        </div>
      );
    }
    const open =
      !!contract.signature_deadline &&
      hoursLeft(contract.signature_deadline) > 0;
    return open ? (
      <p className="flex shrink-0 items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
        <InfoIcon className="size-4 shrink-0" />
        {t('issuer.contracts.state.directorSigns')}
      </p>
    ) : null;
  }
  if (contract.status === 'signed') {
    return (
      <Button
        className="h-10 shrink-0 rounded-xl px-6"
        onClick={() => download.mutate(contract)}
        disabled={download.isPending}
      >
        <DownloadIcon />
        {t('contract.signed.download')}
      </Button>
    );
  }
  if (slow) {
    return (
      <Button
        className="h-10 shrink-0 rounded-xl px-6"
        onClick={onCheckAgain}
        disabled={checking}
      >
        <RefreshCwIcon
          className={cn(checking && 'animate-spin motion-reduce:animate-none')}
        />
        {t('contract.pending.checkAgain')}
      </Button>
    );
  }
  return null;
}
