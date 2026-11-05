import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2Icon, XIcon } from 'lucide-react';
import { useId, useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';
import { showToast } from '@/lib/utils';
import { useContractApi } from '@/queries/contract/api';
import { storedKeys } from '@/queries/contract/options';

/** The longest reason the API takes. */
const maxReason = 500;

/**
 * The director declines a contract awaiting them, for a reason they must write, which its
 * clients and Ulzii & Co staff read. A refusal other than of the reason (the contract no
 * longer awaits them, or they are no longer the director) closes it and shows where the
 * contract stands.
 */
export function IssuerDeclineDialog({ contractId }: { contractId: string }) {
  const { t } = useTranslation();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const queryClient = useQueryClient();
  const api = useContractApi();
  const keys = storedKeys(api);
  const trimmed = reason.trim();
  const decline = useMutation({
    mutationFn: () => api.declineContract(contractId, trimmed),
    onSuccess: (c) => {
      queryClient.setQueryData(keys.detail(c.id), c);
      queryClient.invalidateQueries({ queryKey: keys.list() });
      setOpen(false);
      showToast('success', t('issuer.contracts.decline.done'));
    },
    onError: (err) => {
      const apiErr = toApiError(err);
      showToast('error', apiErrorMessage(apiErr));
      if (apiErr.status !== 422) {
        queryClient.invalidateQueries({ queryKey: keys.detail(contractId) });
        queryClient.invalidateQueries({ queryKey: keys.list() });
        setOpen(false);
      }
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setReason('');
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-10 rounded-xl text-destructive hover:text-destructive"
        >
          <XIcon />
          {t('issuer.contracts.actions.decline')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('issuer.contracts.decline.title')}</DialogTitle>
          <DialogDescription>
            {t('issuer.contracts.decline.text')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor={id}>{t('issuer.contracts.decline.reason')}</Label>
          <Textarea
            id={id}
            value={reason}
            rows={4}
            maxLength={maxReason}
            placeholder={t('issuer.contracts.decline.placeholder')}
            onChange={(e) => setReason(e.target.value)}
          />
          <span className="tabular text-right text-xs text-muted-foreground">
            {reason.length}/{maxReason}
          </span>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="h-10 rounded-xl">
              {t('common.cancel')}
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="h-10 rounded-xl"
            disabled={!trimmed || decline.isPending}
            onClick={() => decline.mutate()}
          >
            {decline.isPending && <Loader2Icon className="animate-spin" />}
            {t('issuer.contracts.decline.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
