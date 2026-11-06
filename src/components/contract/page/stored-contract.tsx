import { useTranslation } from 'react-i18next';
import { DoneStep } from '@/components/contract/done/done-step';
import { PaymentStep } from '@/components/contract/payment/payment-step';
import { awaitingYou } from '@/queries/contract/options';
import { CoSignSteps } from './co-sign-steps';
import { ContractFailed } from './contract-failed';
import { ContractLoading } from './contract-loading';
import type { ContractNav } from './contract-nav';
import { ContractSection } from './contract-section';
import { contractEnded, stoppedStep } from './stopped-step';
import { usePaidToast } from './use-paid-toast';
import { usePdfPolling } from './use-pdf-polling';

/**
 * A stored contract. While an order waits for its payment, the client pays it
 * (PaymentStep), polled until the payment comes. While it waits for the client's own signature, they read it with
 * the signatures given so far and sign it (CoSignSteps). Otherwise it shows whose
 * signatures it waits for, then its PDF rendering, then the signed PDF itself and its
 * download (DoneStep), polling while the PDF renders (usePdfPolling). A cancelled or expired
 * one shows the step it stopped at (stoppedStep).
 */
export function StoredContract({
  contractId,
  nav,
}: {
  contractId: string;
  nav: ContractNav;
}) {
  const { t } = useTranslation();
  const { query, stopped, checkAgain } = usePdfPolling(contractId);
  const { data: contract, isPending, isFetching, error } = query;
  usePaidToast(contract);

  if (isPending) {
    return <ContractLoading />;
  }
  if (error) {
    return <ContractFailed error={error} onBack={nav.toList} />;
  }
  if (contract.status === 'pending_payment' && contract.payment) {
    return <PaymentStep contract={contract} payment={contract.payment} />;
  }
  if (awaitingYou(contract)) {
    return <CoSignSteps contract={contract} nav={nav} />;
  }
  const ended = contractEnded(contract);
  return (
    <ContractSection
      step={stoppedStep(contract)}
      complete={contract.status === 'signed'}
      failed={ended}
      title={ended ? t('contract.sections.ended.title') : undefined}
      description={
        ended
          ? t(
              contract.paid_on
                ? 'contract.sections.ended.paid'
                : 'contract.sections.ended.unpaid',
            )
          : undefined
      }
    >
      <DoneStep
        contract={contract}
        stopped={stopped}
        checking={isFetching}
        onCheckAgain={checkAgain}
        onList={nav.toList}
      />
    </ContractSection>
  );
}
