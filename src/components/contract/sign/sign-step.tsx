import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon, Loader2Icon, PenLineIcon } from 'lucide-react';
import { useState } from 'react';
import { partyLabels, partyName } from '@/components/contract/format';
import { Button } from '@/components/ui/button';
import { toApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';
import { showToast } from '@/lib/utils';
import { contractKeys } from '@/queries/contract/options';
import type { ContractType, PreviewPartyType } from '@/queries/contract/type';
import { AgreeCheck } from './agree-check';
import { SignatureField } from './signature-field';
import { SignersNotice } from './signers-notice';

/**
 * The signed-in client signs their own party here, and only theirs: every other party
 * signs from their own account (others, who still sign). submit sends the drawing, a
 * base64 PNG; a 409 (the template changed, or the contract no longer waits for this
 * signature) calls onConflict.
 */
export function SignStep({
  signer,
  others,
  submit,
  onBack,
  onSigned,
  onConflict,
}: {
  signer: PreviewPartyType;
  others: PreviewPartyType[];
  submit: (image: string) => Promise<ContractType>;
  onBack: () => void;
  onSigned: (contract: ContractType) => void;
  onConflict: () => void;
}) {
  const [drawing, setDrawing] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const queryClient = useQueryClient();

  const sign = useMutation({
    // The data URL's payload is the base64 PNG the API takes.
    mutationFn: () =>
      submit((drawing ?? '').replace(/^data:image\/png;base64,/, '')),
    onSuccess: (c) => {
      queryClient.setQueryData(contractKeys.detail(c.id), c);
      queryClient.invalidateQueries({ queryKey: contractKeys.list() });
      queryClient.invalidateQueries({ queryKey: contractKeys.preview(c.id) });
      onSigned(c);
    },
    onError: (err) => {
      const apiErr = toApiError(err);
      showToast('error', apiErrorMessage(apiErr));
      if (apiErr.status === 409) onConflict();
    },
  });

  return (
    <>
      <SignatureField
        title={partyLabels[signer.type]}
        description={`${partyName(signer)} · ${signer.register_no}`}
        onChange={setDrawing}
      />
      {others.length > 0 && <SignersNotice others={others} />}
      <AgreeCheck checked={agreed} onChange={setAgreed} />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl"
          onClick={onBack}
        >
          <ArrowLeftIcon />
          Гэрээ рүү буцах
        </Button>
        <Button
          type="button"
          className="h-10 rounded-xl px-6"
          disabled={!agreed || !drawing || sign.isPending}
          onClick={() => sign.mutate()}
        >
          {sign.isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <PenLineIcon />
          )}
          {sign.isPending ? 'Илгээж байна...' : 'Гарын үсэг зурах'}
        </Button>
      </div>
    </>
  );
}
