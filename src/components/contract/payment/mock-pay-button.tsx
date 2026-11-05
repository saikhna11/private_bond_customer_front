import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCardIcon, Loader2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { toApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';
import { showToast } from '@/lib/utils';
import { bondKeys } from '@/queries/bond/options';
import { useContractApi } from '@/queries/contract/api';
import { storedKeys } from '@/queries/contract/options';
import { mockPayContract } from '@/queries/contract/query';
import type { PaymentType } from '@/queries/contract/type';
import { MockTransferFields } from './mock-transfer-fields';
import { useMockTransfer } from './use-mock-transfer';

/**
 * Pays the order with the test payment, where the backend allows it. With the local fake
 * bank (mock_bank) it is a real transfer of the case the client picks: exact, short, over or
 * under a wrong reference, which the page then shows as a bank payment would.
 */
export function MockPayButton({
  contractId,
  payment,
}: {
  contractId: string;
  payment: PaymentType;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const keys = storedKeys(useContractApi());
  const transfer = useMockTransfer(payment);
  const pay = useMutation({
    mutationFn: () =>
      mockPayContract(
        contractId,
        payment.mock_bank
          ? { amount: transfer.amount, reference: transfer.reference.trim() }
          : {},
      ),
    onSuccess: (c) => {
      queryClient.setQueryData(keys.detail(c.id), c);
      queryClient.invalidateQueries({ queryKey: keys.list() });
      queryClient.invalidateQueries({ queryKey: bondKeys.all });
      if (c.status !== 'pending_payment') return;
      const received =
        Number(c.payment?.received ?? 0) > Number(payment.received);
      showToast(
        received ? 'warning' : 'error',
        t(
          received
            ? 'contract.payment.mockShort'
            : 'contract.payment.mockUnknown',
        ),
        8000,
      );
    },
    onError: (err) => {
      showToast('error', apiErrorMessage(toApiError(err)));
      queryClient.invalidateQueries({ queryKey: keys.detail(contractId) });
    },
  });
  const ready =
    !payment.mock_bank ||
    (Number(transfer.amount) > 0 && !!transfer.reference.trim());
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed p-3">
      {payment.mock_bank && <MockTransferFields transfer={transfer} />}
      <Button
        className="h-11 w-full rounded-xl"
        disabled={pay.isPending || !ready}
        onClick={() => pay.mutate()}
      >
        {pay.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <CreditCardIcon />
        )}
        {t('contract.payment.mock')}
      </Button>
      <p className="text-xs text-muted-foreground">
        {t(
          payment.mock_bank
            ? 'contract.payment.mockBankText'
            : 'contract.payment.mockText',
        )}
      </p>
    </div>
  );
}
