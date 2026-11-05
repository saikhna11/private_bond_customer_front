import { Card, CardContent } from '@/components/ui/card';
import { yourParty } from '@/queries/contract/options';
import type { ContractType, PaymentType } from '@/queries/contract/type';
import { ContractSection } from '../page/contract-section';
import { CancelOrderButton } from './cancel-order-button';
import { MockPayButton } from './mock-pay-button';
import { PaymentDetails } from './payment-details';
import { PaymentProgress } from './payment-progress';

/**
 * An order waiting for its payment: the account, amount and reference to transfer with, and
 * where the payment stands; the page is polled and moves on to the contract once it is paid.
 * Its holder may pay it with the test button, where allowed, or cancel it before any money
 * came.
 */
export function PaymentStep({
  contract,
  payment,
}: {
  contract: ContractType;
  payment: PaymentType;
}) {
  const holder = yourParty(contract)?.position === 0;
  return (
    <ContractSection step="pay">
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
        <PaymentDetails payment={payment} />
        <Card>
          <CardContent className="flex flex-col gap-4">
            <PaymentProgress payment={payment} />
            {holder && payment.mock && (
              <MockPayButton contractId={contract.id} />
            )}
            {holder && Number(payment.received) === 0 && (
              <CancelOrderButton contractId={contract.id} />
            )}
          </CardContent>
        </Card>
      </div>
    </ContractSection>
  );
}
