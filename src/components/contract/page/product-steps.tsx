import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContractPreview } from '@/components/contract/preview/contract-preview';
import { ToSignButton } from '@/components/contract/preview/to-sign-button';
import { SignStep } from '@/components/contract/sign/sign-step';
import { Button } from '@/components/ui/button';
import {
  productPreviewOptions,
  productsOptions,
} from '@/queries/contract/options';
import { createContract } from '@/queries/contract/query';
import type { Product } from '@/queries/contract/type';
import { ContractFailed } from './contract-failed';
import { ContractLoading } from './contract-loading';
import { ContractSection } from './contract-section';
import { contractsRoute } from './route';

/**
 * A product's contract before it exists: read the preview, then sign the holder's own
 * party, which stores it.
 */
export function ProductSteps({ product }: { product: Product }) {
  const { sign } = contractsRoute.useSearch();
  const { t } = useTranslation();
  const navigate = contractsRoute.useNavigate();
  const queryClient = useQueryClient();
  // One id per purchase: a request sent again, after a lost answer or a second press, finds
  // the contract the first one stored instead of buying another.
  const [requestId] = useState(() => crypto.randomUUID());
  const products = useQuery(productsOptions());
  const info = products.data?.find((p) => p.name === product);
  const previewOptions = productPreviewOptions(product);
  const {
    data: preview,
    isPending,
    error,
  } = useQuery({ ...previewOptions, enabled: !!info });

  if (products.isPending) {
    return <ContractLoading />;
  }
  if (products.error) {
    return <ContractFailed error={products.error} />;
  }
  if (!info) {
    return <ContractFailed message={t('contract.productNotFound')} />;
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
              template_id: preview.template.id,
              request_id: requestId,
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
      </ContractSection>
    );
  }
  return (
    <ContractSection step="view">
      <ContractPreview preview={preview} />
      <div className="flex justify-between">
        <Button
          className="h-10 rounded-xl"
          type="button"
          variant="outline"
          onClick={() => navigate({ to: '/contracts' })}
        >
          {t('contract.back')}
        </Button>
        <ToSignButton
          onClick={() => navigate({ search: { product, sign: true } })}
        />
      </div>
    </ContractSection>
  );
}
