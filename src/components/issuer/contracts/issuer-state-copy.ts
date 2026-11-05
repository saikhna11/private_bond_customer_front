import type { TFunction } from 'i18next';
import { formatDateTime } from '@/components/contract/format';
import type { ContractType } from '@/queries/contract/type';
import { hoursLeft } from './deadline';
import { personName } from './person-name';

/**
 * What one of the issuer's contracts says of where it stands, in t's language: awaiting the
 * director by their deadline, or past it; its PDF rendering, slow once the page stopped
 * polling for it; signed; its PDF failed; declined by the director; or expired.
 */
export function issuerStateCopy(
  t: TFunction,
  c: ContractType,
  slow: boolean,
): { title: string; message: string } {
  const date = (value?: string) => (value ? formatDateTime(value) : '-');
  switch (c.status) {
    case 'pending_issuer_signature':
      return {
        title: t('issuer.contracts.state.pending'),
        message:
          c.signature_deadline && hoursLeft(c.signature_deadline) > 0
            ? t('issuer.contracts.state.pendingText', {
                deadline: date(c.signature_deadline),
              })
            : t('issuer.contracts.state.overdueText'),
      };
    case 'rendering':
      return {
        title: t('issuer.contracts.state.rendering'),
        message: t(
          slow
            ? 'issuer.contracts.state.slowText'
            : 'issuer.contracts.state.renderingText',
        ),
      };
    case 'signed':
      return {
        title: t('issuer.contracts.state.signed'),
        message: t('issuer.contracts.state.signedText', {
          date: date(c.signed_at),
        }),
      };
    case 'failed':
      return {
        title: t('issuer.contracts.state.failed'),
        message: t('issuer.contracts.state.failedText'),
      };
    case 'cancelled': {
      const issuer = c.parties.find((p) => p.type === 'issuer');
      return {
        title: t('issuer.contracts.state.cancelled'),
        message: t('issuer.contracts.state.cancelledText', {
          name: personName(issuer ?? {}),
          date: date(c.cancelled_at),
        }),
      };
    }
    case 'expired':
      return {
        title: t('issuer.contracts.state.expired'),
        message: t('issuer.contracts.state.expiredText', {
          date: date(c.cancelled_at),
        }),
      };
    default:
      // A contract its clients have not finished never reaches the issuer.
      return { title: t(`contract.status.${c.status}`), message: '' };
  }
}
