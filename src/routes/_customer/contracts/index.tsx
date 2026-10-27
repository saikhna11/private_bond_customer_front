import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { PageTitle } from '@/components/common/page-title';
import { ContractList } from '@/components/contract/list/contract-list';
import { ProductSteps } from '@/components/contract/page/product-steps';
import { StoredContract } from '@/components/contract/page/stored-contract';
import { ProductCards } from '@/components/contract/product/product-cards';

/**
 * What the page shows, in the URL so a reload keeps the place: the bonds and the
 * client's contracts by default; a product's preview (product), and whether the holder
 * moved on to signing it (sign); or a stored contract (contractId), which the client
 * signs from here when it waits for their signature (sign). A contract is stored once its
 * first party signs.
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

function ContractPage() {
  const { t } = useTranslation();
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
        title={t('contract.page.title')}
        description={t('contract.page.description')}
      />
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          {t('contract.page.buy')}
        </h2>
        <ProductCards onPick={(p) => navigate({ search: { product: p } })} />
      </section>
      <ContractList onOpen={(id) => navigate({ search: { contractId: id } })} />
    </>
  );
}
