import { createFileRoute, Link } from '@tanstack/react-router';
import { LandmarkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { PageTitle } from '@/components/common/page-title';
import { ContractList } from '@/components/contract/list/contract-list';
import { StoredContract } from '@/components/contract/page/stored-contract';
import { useClientContractNav } from '@/components/contract/page/use-client-contract-nav';
import { Button } from '@/components/ui/button';

/**
 * What the page shows, in the URL so a reload keeps the place: the client's contracts by
 * default, or a stored contract (contractId), which the client signs from here when it
 * waits for their signature (sign). A contract is stored, paid, when its bond is bought.
 */
const searchSchema = z.object({
  sign: z.boolean().optional(),
  contractId: z.uuid().optional(),
});

export const Route = createFileRoute('/_customer/contracts/')({
  validateSearch: searchSchema,
  component: ContractPage,
});

function ContractPage() {
  const { t } = useTranslation();
  const { contractId } = Route.useSearch();
  const navigate = Route.useNavigate();
  const nav = useClientContractNav();

  if (contractId !== undefined) {
    return <StoredContract contractId={contractId} nav={nav} />;
  }
  return (
    <>
      <PageTitle
        title={t('contract.page.title')}
        description={t('contract.page.description')}
        action={
          <Button asChild className="h-10 rounded-xl">
            <Link to="/bonds">
              <LandmarkIcon />
              {t('contract.page.buy')}
            </Link>
          </Button>
        }
      />
      <ContractList onOpen={(id) => navigate({ search: { contractId: id } })} />
    </>
  );
}
