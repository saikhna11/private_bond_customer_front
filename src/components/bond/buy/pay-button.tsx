import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { CreditCardIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { toApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';
import { showToast } from '@/lib/utils';
import { bondKeys } from '@/queries/bond/options';
import { buyBond } from '@/queries/bond/query';
import type { BondType, PurchaseBody } from '@/queries/bond/type';
import { contractsOptions } from '@/queries/contract/options';

/**
 * Pays the purchase with the test payment, until the payments area takes the money: the
 * contract comes back paid and numbered, and the holder goes on to read and sign it. One
 * request id per page: a second press, or a request sent again after a lost answer, finds
 * the contract the first one stored.
 */
export function PayButton({
  bond,
  body,
  disabled,
}: {
  bond: BondType;
  body: PurchaseBody | undefined;
  disabled: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [requestId] = useState(() => crypto.randomUUID());

  const pay = useMutation({
    mutationFn: (b: PurchaseBody) =>
      buyBond(bond.id, { ...b, request_id: requestId }),
    onSuccess: (c) => {
      queryClient.invalidateQueries({ queryKey: bondKeys.all });
      queryClient.invalidateQueries({ queryKey: contractsOptions().queryKey });
      showToast('success', t('bond.quote.paid', { no: c.contract_no ?? '' }));
      navigate({ to: '/contracts', search: { contractId: c.id } });
    },
    onError: (err) => {
      showToast('error', apiErrorMessage(toApiError(err)));
      queryClient.invalidateQueries({ queryKey: bondKeys.all });
    },
  });

  return (
    <Button
      type="button"
      className="h-11 w-full rounded-xl"
      disabled={disabled || !body || pay.isPending}
      onClick={() => body && pay.mutate(body)}
    >
      {pay.isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <CreditCardIcon />
      )}
      {t('bond.quote.pay')}
    </Button>
  );
}
