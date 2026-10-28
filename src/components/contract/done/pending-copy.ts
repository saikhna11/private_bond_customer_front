import type { TFunction } from 'i18next';
import { partyLabel, partyName } from '@/components/contract/format';
import type { ContractType } from '@/queries/contract/type';

/**
 * What a contract not signed yet says of itself, in t's language: cancelled by a party,
 * expired, its PDF failed, waiting for the other parties' signatures, or its PDF
 * rendering, slow once the page stopped polling for it.
 */
export function pendingCopy(
  t: TFunction,
  contract: ContractType,
  slow: boolean,
): { title: string; message: string } {
  if (contract.status === 'expired') {
    return {
      title: t('contract.pending.expiredTitle'),
      message: t('contract.pending.expired'),
    };
  }
  if (contract.status === 'failed') {
    return {
      title: t('contract.pending.failedTitle'),
      message: t('contract.pending.failed'),
    };
  }
  if (contract.status === 'cancelled') {
    const decliner = contract.parties.find((p) => p.declined_at);
    return {
      title: t('contract.pending.cancelled'),
      message: t('contract.pending.declinedBy', {
        who: decliner
          ? `${partyLabel(decliner.type)} ${partyName(decliner)}`
          : t('contract.pending.someParty'),
      }),
    };
  }
  const title = t('contract.pending.received');
  if (contract.status === 'pending_signature') {
    return { title, message: t('contract.pending.awaitingOthers') };
  }
  if (slow) {
    return { title, message: t('contract.pending.slow') };
  }
  return { title, message: t('contract.pending.rendering') };
}
