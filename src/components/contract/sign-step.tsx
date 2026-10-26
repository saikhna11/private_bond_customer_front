import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  InfoIcon,
  Loader2Icon,
  PenLineIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toApiError } from '@/lib/fetcher';
import { apiErrorMessage } from '@/lib/i18n';
import { showToast } from '@/lib/utils';
import { contractKeys } from '@/queries/contract/options';
import type { ContractType, PreviewPartyType } from '@/queries/contract/type';
import { partyLabels, partyName } from './format';
import { SignatureField } from './signature-pad';

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
        title={`${partyLabels[signer.type]} (та)`}
        description={`${partyName(signer)} · ${signer.register_no}`}
        onChange={setDrawing}
      />
      {others.length > 0 && (
        <Card className="border-dashed py-0">
          <CardContent className="flex items-start gap-3 p-5 text-sm">
            <InfoIcon className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="space-y-1">
              <p>
                {others
                  .map((p) => `${partyLabels[p.type]} ${partyName(p)}`)
                  .join(', ')}{' '}
                өөрийн бүртгэлээр нэвтэрч гарын үсгээ зурна.
              </p>
              <p className="text-muted-foreground">
                Бүх тал 72 цагийн дотор зурсны дараа гэрээ дугаарлагдаж
                баталгаажна. Эс бөгөөс гэрээ цуцлагдана.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      <Card className="py-0">
        <CardContent className="flex items-start gap-3 p-5">
          <Checkbox
            id="agree"
            checked={agreed}
            onCheckedChange={(v) => setAgreed(v === true)}
          />
          <Label htmlFor="agree" className="leading-snug font-normal">
            Гэрээний нөхцөлтэй бүрэн танилцаж, зөвшөөрч байна. Бүх тал гарын
            үсгээ зурсны дараа гэрээ байгуулагдаж, дугаар олгогдоно.
          </Label>
        </CardContent>
      </Card>
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
