import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { showToast } from '@/lib/utils';
import type { ContractType } from '@/queries/contract/type';

/** Says so once an order the page showed waiting for its payment is paid. */
export function usePaidToast(contract: ContractType | undefined) {
  const { t } = useTranslation();
  const status = contract?.status;
  const no = contract?.contract_no;
  const was = useRef(status);
  useEffect(() => {
    if (
      was.current === 'pending_payment' &&
      status === 'pending_customer_signature'
    ) {
      showToast('success', t('contract.payment.paid', { no: no ?? '' }));
    }
    was.current = status;
  }, [status, no, t]);
}
