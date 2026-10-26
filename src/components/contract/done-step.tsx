import { useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  DownloadIcon,
  LoaderCircleIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn, showToast } from '@/lib/utils';
import { contractKeys, yourParty } from '@/queries/contract/options';
import type { ContractType } from '@/queries/contract/type';
import { ContractStatusBadge } from './contract-status-badge';
import { DeclineButton } from './decline-button';
import { useDownloadContract } from './download';
import {
  contractNumber,
  formatAmount,
  formatDateTime,
  partyLabels,
  partyName,
} from './format';

/**
 * A stored contract as the client sees it once they signed or declined: whose signatures
 * it still waits for, then its signed PDF rendering, then the download. stopped says the
 * page gave up polling for the PDF; onCheckAgain checks once and polls again.
 */
export function DoneStep({
  contract,
  stopped,
  checking,
  onCheckAgain,
  onList,
}: {
  contract: ContractType;
  stopped: boolean;
  checking: boolean;
  onCheckAgain: () => void;
  onList: () => void;
}) {
  const download = useDownloadContract();
  const queryClient = useQueryClient();
  const { status } = contract;
  const signed = status === 'signed';
  const slow = status === 'rendering' && stopped;
  const you = yourParty(contract);

  // Announce the PDF when it becomes ready while the page is open, not on every visit.
  const wasSigned = useRef(signed);
  useEffect(() => {
    if (signed && !wasSigned.current) {
      showToast('success', `${contractNumber(contract)} гэрээ баталгаажлаа.`);
      queryClient.invalidateQueries({ queryKey: contractKeys.list() });
    }
    wasSigned.current = signed;
  }, [signed, contract, queryClient]);

  let title = 'Гарын үсгийг хүлээн авлаа';
  let message =
    'Гэрээний эцсийн хувийг бэлтгэж байна. Энэ хуудас бэлэн болмогц шинэчлэгдэнэ.';
  if (signed) {
    title = 'Гэрээ баталгаажлаа';
    message = `${contractNumber(contract)} дугаартай гэрээний эх хувийг татаж авна уу.`;
  } else if (status === 'cancelled') {
    title = 'Гэрээ цуцлагдсан';
    const decliner = contract.parties.find((p) => p.declined_at);
    message =
      contract.cancel_reason === 'expired'
        ? 'Бүх тал хугацаандаа гарын үсэг зураагүй тул гэрээ цуцлагдлаа.'
        : `${decliner ? `${partyLabels[decliner.type]} ${partyName(decliner)}` : 'Гэрээний тал'} татгалзсан тул гэрээ цуцлагдлаа.`;
  } else if (status === 'pending_signature') {
    message =
      'Бусад талын гарын үсгийг хүлээж байна. Тэд өөрсдийн бүртгэлээр нэвтэрч зурна. Бүгд зурсны дараа гэрээ дугаарлагдаж, эцсийн хувь бэлтгэгдэнэ.';
  } else if (slow) {
    message =
      'Гэрээний эцсийн хувийг бэлтгэхэд ердийнхөөс удаж байна. "Дахин шалгах" товчийг дарах, эсвэл дараа нь гэрээнийхээ жагсаалтаас шалгана уу.';
  }

  const Icon = signed
    ? CircleCheckIcon
    : status === 'cancelled'
      ? CircleXIcon
      : slow || status === 'pending_signature'
        ? ClockIcon
        : LoaderCircleIcon;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-6 py-6 text-center">
        <span
          className={cn(
            'flex size-16 items-center justify-center rounded-full',
            signed && 'bg-success/12 text-success',
            status === 'cancelled' && 'bg-destructive/10 text-destructive',
            !signed &&
              status !== 'cancelled' &&
              'bg-warning/15 text-warning-foreground dark:text-warning',
          )}
        >
          <Icon
            className={cn(
              'size-8',
              Icon === LoaderCircleIcon &&
                'animate-spin motion-reduce:animate-none',
            )}
          />
        </span>
        <div className="max-w-md space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <dl className="grid w-full max-w-md grid-cols-2 gap-3 text-left text-sm">
          <div className="rounded-xl bg-muted/60 px-3 py-2">
            <dt className="text-xs text-muted-foreground">Гэрээний дугаар</dt>
            <dd className="font-semibold">{contractNumber(contract)}</dd>
          </div>
          <div className="rounded-xl bg-muted/60 px-3 py-2">
            <dt className="text-xs text-muted-foreground">Дүн</dt>
            <dd className="tabular font-semibold">
              {formatAmount(contract.principal_amount)} ₮
            </dd>
          </div>
          <div className="col-span-2 flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
            <dt className="text-xs text-muted-foreground">Төлөв</dt>
            <dd>
              <ContractStatusBadge status={status} />
            </dd>
          </div>
          {status === 'pending_signature' && contract.signature_deadline && (
            <div className="col-span-2 flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
              <dt className="text-xs text-muted-foreground">
                Гарын үсэг зурах эцсийн хугацаа
              </dt>
              <dd className="tabular font-semibold">
                {formatDateTime(contract.signature_deadline)}
              </dd>
            </div>
          )}
        </dl>
        <PartyStatuses contract={contract} />
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            className="h-10 rounded-xl"
            onClick={onList}
          >
            <ArrowLeftIcon />
            Гэрээнүүд
          </Button>
          {status === 'pending_signature' && you?.signs && (
            <DeclineButton contractId={contract.id} signed={!!you.signed_at} />
          )}
          {slow && (
            <Button
              className="h-10 rounded-xl px-6"
              onClick={onCheckAgain}
              disabled={checking}
            >
              <RefreshCwIcon
                className={cn(
                  checking && 'animate-spin motion-reduce:animate-none',
                )}
              />
              Дахин шалгах
            </Button>
          )}
          {signed && (
            <Button
              className="h-10 rounded-xl px-6"
              onClick={() => download.mutate(contract)}
              disabled={download.isPending}
            >
              <DownloadIcon />
              PDF татах
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/** Each party who signs the contract, and whether they signed, declined or are awaited. */
export function PartyStatuses({ contract }: { contract: ContractType }) {
  const signers = contract.parties.filter((p) => p.signs);
  return (
    <ul className="w-full max-w-md divide-y rounded-xl border text-left text-sm">
      {signers.map((p) => {
        const state = p.signed_at
          ? {
              label: 'Зурсан',
              className: 'text-success',
              Icon: CircleCheckIcon,
            }
          : p.declined_at
            ? {
                label: 'Татгалзсан',
                className: 'text-destructive',
                Icon: CircleXIcon,
              }
            : {
                label:
                  contract.status === 'pending_signature'
                    ? 'Хүлээгдэж байна'
                    : 'Зураагүй',
                className: 'text-warning-foreground dark:text-warning',
                Icon: ClockIcon,
              };
        return (
          <li
            key={p.id}
            className="flex items-center justify-between gap-3 px-3 py-2"
          >
            <span className="min-w-0">
              <span className="block text-xs text-muted-foreground">
                {partyLabels[p.type]}
                {p.id === contract.your_party_id && ' (та)'}
              </span>
              <span className="block truncate font-medium">{partyName(p)}</span>
            </span>
            <span
              className={cn(
                'flex shrink-0 items-center gap-1 text-xs font-medium',
                state.className,
              )}
            >
              <state.Icon className="size-3.5" />
              {state.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
