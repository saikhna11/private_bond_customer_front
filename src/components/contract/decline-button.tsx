import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2Icon, XIcon } from 'lucide-react';
import { useState } from 'react';
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
import { contractKeys } from '@/queries/contract/options';
import { declineContract } from '@/queries/contract/query';

/**
 * Cancels a contract pending signature for every party, once confirmed. signed says the
 * client already signed it: they withdraw rather than decline.
 */
export function DeclineButton({
  contractId,
  signed,
}: {
  contractId: string;
  signed: boolean;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const decline = useMutation({
    mutationFn: () => declineContract(contractId),
    onSuccess: (c) => {
      queryClient.setQueryData(contractKeys.detail(c.id), c);
      queryClient.invalidateQueries({ queryKey: contractKeys.list() });
      setOpen(false);
    },
    onError: (err) => {
      showToast('error', apiErrorMessage(toApiError(err)));
      queryClient.invalidateQueries({
        queryKey: contractKeys.detail(contractId),
      });
      setOpen(false);
    },
  });
  const action = signed ? 'Гэрээг цуцлах' : 'Гэрээнээс татгалзах';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-10 rounded-xl text-destructive hover:text-destructive"
        >
          <XIcon />
          {action}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{action}?</DialogTitle>
          <DialogDescription>
            Гэрээ бүх талын хувьд цуцлагдаж, дахин гарын үсэг зурах боломжгүй
            болно. Шаардлагатай бол шинэ гэрээ байгуулна.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="h-10 rounded-xl">
              Болих
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="h-10 rounded-xl"
            disabled={decline.isPending}
            onClick={() => decline.mutate()}
          >
            {decline.isPending && <Loader2Icon className="animate-spin" />}
            {action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
