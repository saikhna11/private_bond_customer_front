import type { TFunction } from 'i18next';
import { partyLabel, partyName } from '@/components/contract/format';
import type { ContractType } from '@/queries/contract/type';

/**
 * What a contract not signed yet says of itself, in t's language: cancelled by a party,
 * expired, its PDF failed, waiting for the other parties' signatures, or its PDF
 * rendering, slow once the page stopped polling for it. An order ends unpaid when its payment
 * deadline passes or its holder cancels it. A paid contract ends only at the bond issuer's
 * director's turn: they declined it, or let their deadline pass.
 */
export function pendingCopy(
  t: TFunction,
  contract: ContractType,
  slow: boolean,
): { title: string; message: string } {
  // An order that ended before it was paid: it lapsed, or its holder cancelled it.
  if (contract.payment && !contract.paid_on) {
    if (contract.status === 'expired') {
      return {
        title: t('contract.payment.expiredTitle'),
        message: t('contract.payment.expired'),
      };
    }
    if (contract.status === 'cancelled') {
      return {
        title: t('contract.pending.cancelled'),
        message: t('contract.payment.cancelled'),
      };
    }
  }
  if (contract.status === 'expired') {
    return {
      title: t('contract.pending.expiredTitle'),
      message: t(
        contract.paid_on
          ? 'contract.pending.expiredIssuer'
          : 'contract.pending.expired',
      ),
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
    if (decliner?.type === 'issuer') {
      return {
        title: t('contract.pending.cancelled'),
        message: t('contract.pending.declinedByIssuer'),
      };
    }
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
  if (contract.status === 'pending_customer_signature') {
    return { title, message: t('contract.pending.awaitingOthers') };
  }
  if (contract.status === 'pending_issuer_signature') {
    return { title, message: t('contract.pending.awaitingIssuer') };
  }
  if (slow) {
    return { title, message: t('contract.pending.slow') };
  }
  return { title, message: t('contract.pending.rendering') };
}
