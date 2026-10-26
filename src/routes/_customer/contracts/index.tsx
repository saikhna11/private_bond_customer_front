import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeftIcon, PenLineIcon, UsersRoundIcon } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import z from 'zod';
import { ApiErrorAlert } from '@/components/common/api-error-alert';
import { PageTitle } from '@/components/common/page-title';
import { CoHolderStep } from '@/components/contract/co-holder-step';
import { ContractList } from '@/components/contract/contract-list';
import { ContractPreview } from '@/components/contract/contract-preview';
import { DeclineButton } from '@/components/contract/decline-button';
import { DoneStep, PartyStatuses } from '@/components/contract/done-step';
import { ProductCards } from '@/components/contract/product-cards';
import { SignStep } from '@/components/contract/sign-step';
import { type Step, Steps } from '@/components/contract/steps';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toApiError } from '@/lib/fetcher';
import {
  awaitingYou,
  contractKeys,
  contractOptions,
  contractPreviewOptions,
  pdfPollDelay,
  pdfPollLimit,
  productPreviewOptions,
  productsOptions,
  yourParty,
} from '@/queries/contract/options';
import { createContract, signContract } from '@/queries/contract/query';
import type { CoHolder, ContractType, Product } from '@/queries/contract/type';

/**
 * What the page shows, in the URL so a reload keeps the place: the bonds and the
 * client's contracts by default; a product's preview (product), and whether the holder
 * moved on to signing it (sign); or a stored contract (contractId), which the client
 * signs from here when it waits for their signature (sign). A contract is stored once its
 * first party signs; a co-holder stays in the page's memory, never the URL.
 */
const searchSchema = z.object({
  product: z.string().min(1).max(20).optional(),
  sign: z.boolean().optional(),
  contractId: z.uuid().optional(),
});

export const Route = createFileRoute('/_customer/contracts/')({
  validateSearch: searchSchema,
  component: ContractPage,
});

const titles: Record<Step, { title: string; description: string }> = {
  create: { title: 'Бонд сонгох', description: '' },
  view: {
    title: 'Гэрээтэй танилцах',
    description: 'Нөхцөл болон гэрээний эхийг анхааралтай уншина уу.',
  },
  sign: {
    title: 'Гарын үсэг зурах',
    description:
      'Та өөрийн гарын үсгийг зурна. Бусад тал өөрсдийн бүртгэлээр нэвтэрч зурна.',
  },
  done: {
    title: 'Гэрээ',
    description: 'Гэрээний эх хувь бэлэн болмогц татаж авах боломжтой.',
  },
};

function ContractPage() {
  const { product, contractId } = Route.useSearch();
  const navigate = Route.useNavigate();

  if (contractId !== undefined) {
    return <StoredContract contractId={contractId} />;
  }
  if (product !== undefined) {
    return <ProductSteps product={product} />;
  }
  return (
    <>
      <PageTitle
        title="Гэрээ, гэрчилгээ"
        description="Бонд сонгож гэрээгээ уншаад гарын үсэг зурна. Баталгаажсан гэрээний эх хувийг эндээс татаж авна."
      />
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Бонд худалдан авах
        </h2>
        <ProductCards onPick={(p) => navigate({ search: { product: p } })} />
      </section>
      <ContractList onOpen={(id) => navigate({ search: { contractId: id } })} />
    </>
  );
}

/** One step of buying a bond: the way back, the step's title and where it sits. */
function Section({
  step,
  complete,
  title = titles[step].title,
  description = titles[step].description,
  children,
}: {
  step: Step;
  complete?: boolean;
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-6">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 self-start rounded-lg text-muted-foreground"
      >
        <Link to="/contracts" search={{}}>
          <ArrowLeftIcon />
          Гэрээнүүд
        </Link>
      </Button>
      <PageTitle title={title} description={description} />
      <Card className="py-0">
        <CardContent className="px-4 py-5 sm:px-6">
          <Steps current={step} complete={complete} />
        </CardContent>
      </Card>
      {children}
    </div>
  );
}

function Loading() {
  return (
    <div className="flex w-full max-w-4xl flex-col gap-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

function Failed({ error, message }: { error?: unknown; message?: string }) {
  const navigate = Route.useNavigate();
  return (
    <div className="flex w-full max-w-4xl flex-col items-start gap-4">
      {error ? (
        <ApiErrorAlert error={toApiError(error)} />
      ) : (
        <p className="text-sm text-destructive">{message}</p>
      )}
      <Button
        variant="outline"
        className="h-10 rounded-xl"
        onClick={() => navigate({ search: {} })}
      >
        <ArrowLeftIcon />
        Гэрээнүүд
      </Button>
    </div>
  );
}

/**
 * A product's contract before it exists: name the co-holder, for a bond with one, read the
 * preview, then sign the holder's own party, which stores it.
 */
function ProductSteps({ product }: { product: Product }) {
  const { sign } = Route.useSearch();
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();
  const [coHolder, setCoHolder] = useState<CoHolder | null>(null);
  // One id per purchase: a request sent again, after a lost answer or a second press, finds
  // the contract the first one stored instead of buying another.
  const [requestId] = useState(() => crypto.randomUUID());
  const [editingCoHolder, setEditingCoHolder] = useState(false);
  const products = useQuery(productsOptions());
  const info = products.data?.find((p) => p.name === product);
  const needsCoHolder = info?.co_holder ?? false;
  const asking = needsCoHolder && (!coHolder || editingCoHolder);
  const previewOptions = productPreviewOptions(product, coHolder ?? undefined);
  const {
    data: preview,
    isPending,
    error,
  } = useQuery({ ...previewOptions, enabled: !!info && !asking });

  if (products.isPending) {
    return <Loading />;
  }
  if (products.error) {
    return <Failed error={products.error} />;
  }
  if (!info) {
    return <Failed message="Бүтээгдэхүүн олдсонгүй." />;
  }
  if (asking) {
    return (
      <Section
        step="view"
        title="Хамтран эзэмшигч"
        description="Гэрээнд хамт нэр орох харилцагчийг оруулна уу."
      >
        <CoHolderStep
          product={product}
          initial={coHolder}
          onDone={(c) => {
            setCoHolder(c);
            setEditingCoHolder(false);
            navigate({ search: { product } });
          }}
        />
      </Section>
    );
  }
  if (isPending) {
    return <Loading />;
  }
  if (error) {
    return <Failed error={error} />;
  }
  const holder = preview.parties.find((p) => p.position === 0);
  if (sign && holder) {
    return (
      <Section step="sign">
        <SignStep
          signer={holder}
          others={preview.parties.filter((p) => p.signs && p !== holder)}
          submit={(signature) =>
            createContract({
              product,
              template_id: preview.template.id,
              request_id: requestId,
              co_holder: coHolder ?? undefined,
              signature,
            })
          }
          onBack={() => navigate({ search: { product } })}
          onSigned={(c) => navigate({ search: { contractId: c.id } })}
          onConflict={() => {
            // The template changed since the preview: read the new one before signing.
            queryClient.invalidateQueries({
              queryKey: previewOptions.queryKey,
            });
            navigate({ search: { product } });
          }}
        />
      </Section>
    );
  }
  return (
    <Section step="view">
      <ContractPreview preview={preview} />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {needsCoHolder && (
          <Button
            variant="outline"
            className="h-10 rounded-xl"
            onClick={() => setEditingCoHolder(true)}
          >
            <UsersRoundIcon />
            Хамтран эзэмшигчийг солих
          </Button>
        )}
        <Button
          className="h-10 rounded-xl px-6"
          onClick={() => navigate({ search: { product, sign: true } })}
        >
          <PenLineIcon />
          Гарын үсэг зурах руу
        </Button>
      </div>
    </Section>
  );
}

/**
 * A stored contract. While it waits for the client's own signature, they read it with
 * the signatures given so far and sign it (CoSignSteps). Otherwise it shows whose
 * signatures it waits for, then its PDF rendering, then the download. While the PDF
 * renders, the page polls often at first and less often after (pdfPollDelay), only while
 * the tab is visible, and stops after pdfPollLimit; checking again starts over.
 */
function StoredContract({ contractId }: { contractId: string }) {
  const navigate = Route.useNavigate();
  const [since, setSince] = useState(() => Date.now());
  const [stopped, setStopped] = useState(false);
  const {
    data: contract,
    isPending,
    isFetching,
    error,
    refetch,
  } = useQuery({
    ...contractOptions(contractId),
    refetchInterval: (query) =>
      stopped || query.state.data?.status !== 'rendering'
        ? false
        : pdfPollDelay(Date.now() - since),
  });
  const rendering = contract?.status === 'rendering';

  // The PDF starts rendering when the last party signs, which may be long after the page
  // opened: its polling schedule counts from then. Adjusting the state while rendering, not
  // in an effect, keeps the stop timer from ever seeing the old start.
  const [wasRendering, setWasRendering] = useState(rendering);
  if (rendering !== wasRendering) {
    setWasRendering(rendering);
    if (rendering) {
      setSince(Date.now());
      setStopped(false);
    }
  }

  useEffect(() => {
    if (!rendering || stopped) return;
    const timer = setTimeout(
      () => setStopped(true),
      Math.max(0, pdfPollLimit - (Date.now() - since)),
    );
    return () => clearTimeout(timer);
  }, [rendering, stopped, since]);

  const checkAgain = () => {
    setSince(Date.now());
    setStopped(false);
    void refetch();
  };

  if (isPending) {
    return <Loading />;
  }
  if (error) {
    return <Failed error={error} />;
  }
  if (awaitingYou(contract)) {
    return <CoSignSteps contract={contract} />;
  }
  return (
    <Section step="done" complete={contract.status === 'signed'}>
      <DoneStep
        contract={contract}
        stopped={stopped}
        checking={isFetching}
        onCheckAgain={checkAgain}
        onList={() => navigate({ search: {} })}
      />
    </Section>
  );
}

/**
 * A stored contract waiting for the client's own signature: they read the document with
 * the other parties' signatures in place, then sign their own party, or decline it.
 */
function CoSignSteps({ contract }: { contract: ContractType }) {
  const { sign } = Route.useSearch();
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();
  const {
    data: preview,
    isPending,
    error,
  } = useQuery(contractPreviewOptions(contract.id));
  const you = yourParty(contract);
  const back = () => navigate({ search: { contractId: contract.id } });

  if (isPending) {
    return <Loading />;
  }
  if (error) {
    return <Failed error={error} />;
  }
  const signer = preview.parties.find((p) => p.position === you?.position);
  if (sign && signer) {
    const waiting = new Set(
      contract.parties
        .filter((p) => p.signs && !p.signed_at && p.id !== you?.id)
        .map((p) => p.position),
    );
    return (
      <Section step="sign">
        <SignStep
          signer={signer}
          others={preview.parties.filter((p) => waiting.has(p.position))}
          submit={(signature) => signContract(contract.id, signature)}
          onBack={back}
          onSigned={back}
          onConflict={() => {
            // The contract no longer waits for this signature: show where it stands.
            queryClient.invalidateQueries({
              queryKey: contractKeys.detail(contract.id),
            });
            back();
          }}
        />
      </Section>
    );
  }
  return (
    <Section step="view">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <p className="max-w-md text-sm text-muted-foreground">
            Энэ гэрээ таны гарын үсгийг хүлээж байна. Бусад талын зурсан гарын
            үсэг гэрээний эх дээр харагдана.
          </p>
          <PartyStatuses contract={contract} />
        </CardContent>
      </Card>
      <ContractPreview preview={preview} />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <DeclineButton contractId={contract.id} signed={false} />
        <Button
          className="h-10 rounded-xl px-6"
          onClick={() =>
            navigate({ search: { contractId: contract.id, sign: true } })
          }
        >
          <PenLineIcon />
          Гарын үсэг зурах руу
        </Button>
      </div>
    </Section>
  );
}
