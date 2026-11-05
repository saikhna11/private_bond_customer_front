import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { contractNumber } from '@/components/contract/format';
import i18n from '@/lib/i18n';
import { showToast } from '@/lib/utils';
import { useContractApi } from '@/queries/contract/api';
import { storedKeys } from '@/queries/contract/options';
import type { ContractType } from '@/queries/contract/type';

/**
 * Announces the contract's PDF when it becomes ready while the page is open, not on every
 * visit, and refreshes the list, which then shows it signed.
 */
export function useSignedToast(contract: ContractType) {
  const queryClient = useQueryClient();
  const keys = storedKeys(useContractApi());
  const signed = contract.status === 'signed';
  const wasSigned = useRef(signed);

  useEffect(() => {
    if (signed && !wasSigned.current) {
      showToast(
        'success',
        i18n.t('contract.signed.toast', { no: contractNumber(contract) }),
      );
      queryClient.invalidateQueries({ queryKey: keys.list() });
    }
    wasSigned.current = signed;
  }, [signed, contract, queryClient, keys]);
}
