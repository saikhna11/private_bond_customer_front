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

/** Pays the order at once with the test payment, where the backend allows it. */
export function MockPayButton({ contractId }: { contractId: string }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const keys = storedKeys(useContractApi());
  const pay = useMutation({
    mutationFn: () => mockPayContract(contractId),
    onSuccess: (c) => {
      queryClient.setQueryData(keys.detail(c.id), c);
      queryClient.invalidateQueries({ queryKey: keys.list() });
      queryClient.invalidateQueries({ queryKey: bondKeys.all });
    },
    onError: (err) => {
      showToast('error', apiErrorMessage(toApiError(err)));
      queryClient.invalidateQueries({ queryKey: keys.detail(contractId) });
    },
  });
  return (
    <div className="flex flex-col gap-2">
      <Button
        className="h-11 w-full rounded-xl"
        disabled={pay.isPending}
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
        {t('contract.payment.mockText')}
      </p>
    </div>
  );
}
