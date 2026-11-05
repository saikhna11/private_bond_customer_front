import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2Icon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';
import { showToast } from '@/lib/utils';
import { bondKeys } from '@/queries/bond/options';
import { useContractApi } from '@/queries/contract/api';
import { storedKeys } from '@/queries/contract/options';

/** Cancels the holder's order no money came for yet, once confirmed. */
export function CancelOrderButton({ contractId }: { contractId: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const api = useContractApi();
  const keys = storedKeys(api);
  const cancel = useMutation({
    mutationFn: () => api.declineContract(contractId),
    onSuccess: (c) => {
      queryClient.setQueryData(keys.detail(c.id), c);
      queryClient.invalidateQueries({ queryKey: keys.list() });
      queryClient.invalidateQueries({ queryKey: bondKeys.all });
      setOpen(false);
    },
    onError: (err) => {
      showToast('error', apiErrorMessage(toApiError(err)));
      queryClient.invalidateQueries({ queryKey: keys.detail(contractId) });
      setOpen(false);
    },
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-10 w-full rounded-xl text-destructive hover:text-destructive"
        >
          <XIcon />
          {t('contract.payment.cancel')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('contract.payment.cancelTitle')}</DialogTitle>
          <DialogDescription>
            {t('contract.payment.cancelText')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="h-10 rounded-xl">
              {t('common.cancel')}
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="h-10 rounded-xl"
            disabled={cancel.isPending}
            onClick={() => cancel.mutate()}
          >
            {cancel.isPending && <Loader2Icon className="animate-spin" />}
            {t('contract.payment.cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
