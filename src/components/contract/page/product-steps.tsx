import { useQuery, useQueryClient } from '@tanstack/react-query';
import { UsersRoundIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CoHolderStep } from '@/components/contract/co-holder/co-holder-step';
import { ContractPreview } from '@/components/contract/preview/contract-preview';
import { ToSignButton } from '@/components/contract/preview/to-sign-button';
import { SignStep } from '@/components/contract/sign/sign-step';
import { Button } from '@/components/ui/button';
import {
  productPreviewOptions,
  productsOptions,
} from '@/queries/contract/options';
import { createContract } from '@/queries/contract/query';
import type {
  CoHolder,
  Product,
  PurchasableOwnership,
} from '@/queries/contract/type';
import { ContractFailed } from './contract-failed';
import { ContractLoading } from './contract-loading';
import { ContractSection } from './contract-section';
import { contractsRoute } from './route';

/**
 * A product's contract of ownership before it exists: name the co-holder of a joint one,
 * read the preview, then sign the holder's own party, which stores it. The co-holder signs
 * later, from their own account.
 */
export function ProductSteps({
  product,
  ownership,
}: {
  product: Product;
  ownership: PurchasableOwnership;
}) {
  const { sign } = contractsRoute.useSearch();
  const { t } = useTranslation();
  const navigate = contractsRoute.useNavigate();
  const queryClient = useQueryClient();
  const [coHolder, setCoHolder] = useState<CoHolder | null>(null);
  const [editingCoHolder, setEditingCoHolder] = useState(false);
  // One id per purchase: a request sent again, after a lost answer or a second press, finds
  // the contract the first one stored instead of buying another.
  const [requestId] = useState(() => crypto.randomUUID());
  const products = useQuery(productsOptions());
  const info = products.data?.find((p) => p.name === product);
  const needsCoHolder = ownership === 'joint';
  const asking = needsCoHolder && (!coHolder || editingCoHolder);
  const previewOptions = productPreviewOptions(
    product,
    ownership,
    coHolder ?? undefined,
  );
  const {
    data: preview,
    isPending,
    error,
  } = useQuery({ ...previewOptions, enabled: !!info && !asking });

  if (products.isPending) {
    return <ContractLoading />;
  }
  if (products.error) {
    return <ContractFailed error={products.error} />;
  }
  if (!info) {
    return <ContractFailed message={t('contract.productNotFound')} />;
  }
  if (asking) {
    return (
      <ContractSection
        step="create"
        title={t('contract.coHolder.title')}
        description={t('contract.coHolder.description')}
      >
        <CoHolderStep
          product={product}
          initial={coHolder}
          onDone={(c) => {
            setCoHolder(c);
            setEditingCoHolder(false);
            navigate({ search: { product, ownership } });
          }}
          onBack={() =>
            coHolder
              ? setEditingCoHolder(false)
              : navigate({ to: '/contracts' })
          }
        />
      </ContractSection>
    );
  }
  if (isPending) {
    return <ContractLoading />;
  }
  if (error) {
    return <ContractFailed error={error} />;
  }
  const holder = preview.parties.find((p) => p.position === 0);
  if (sign && holder) {
    return (
      <ContractSection step="sign">
        <SignStep
          signer={holder}
          others={preview.parties.filter((p) => p.signs && p !== holder)}
          submit={(signature) =>
            createContract({
              product,
              ownership_type: ownership,
              template_id: preview.template.id,
              request_id: requestId,
              co_holder: coHolder ?? undefined,
              signature,
            })
          }
          onBack={() => navigate({ search: { product, ownership } })}
          onSigned={(c) => navigate({ search: { contractId: c.id } })}
          onConflict={() => {
            // The template changed since the preview: read the new one before signing.
            queryClient.invalidateQueries({
              queryKey: previewOptions.queryKey,
            });
            navigate({ search: { product, ownership } });
          }}
        />
      </ContractSection>
    );
  }
  return (
    <ContractSection step="view">
      <ContractPreview preview={preview} />
      <div className="flex flex-wrap justify-between gap-3">
        <Button
          className="h-10 rounded-xl"
          type="button"
          variant="outline"
          onClick={() => navigate({ to: '/contracts' })}
        >
          {t('contract.back')}
        </Button>
        <div className="flex flex-wrap gap-3">
          {needsCoHolder && (
            <Button
              className="h-10 rounded-xl"
              type="button"
              variant="outline"
              onClick={() => setEditingCoHolder(true)}
            >
              <UsersRoundIcon />
              {t('contract.coHolder.change')}
            </Button>
          )}
          <ToSignButton
            onClick={() =>
              navigate({ search: { product, ownership, sign: true } })
            }
          />
        </div>
      </div>
    </ContractSection>
  );
}
