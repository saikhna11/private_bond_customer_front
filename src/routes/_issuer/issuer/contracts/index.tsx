import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { PageTitle } from '@/components/common/page-title';
import { IssuerContractDetail } from '@/components/issuer/contracts/issuer-contract-detail';
import { IssuerContractList } from '@/components/issuer/contracts/issuer-contract-list';
import { useIssuerContractNav } from '@/components/issuer/contracts/use-issuer-contract-nav';
import { ContractApiContext, issuerContractApi } from '@/queries/contract/api';
import { issuerContractTabSchema } from '@/queries/issuer/type';

/**
 * The bond issuer's contracts, which every member reads once their clients signed them: the
 * list, a tab (pending when left out) and a page at a time, or one contract (contractId),
 * which the director signs from here (sign) or declines while it waits for them.
 */
const searchSchema = z.object({
  tab: issuerContractTabSchema.optional().catch(undefined),
  page: z.number().int().min(1).optional().catch(undefined),
  sign: z.boolean().optional(),
  contractId: z.uuid().optional(),
});

export const Route = createFileRoute('/_issuer/issuer/contracts/')({
  validateSearch: searchSchema,
  component: IssuerContractsPage,
});

function IssuerContractsPage() {
  const { t } = useTranslation();
  const { contractId } = Route.useSearch();
  const nav = useIssuerContractNav();

  return (
    <ContractApiContext.Provider value={issuerContractApi}>
      {contractId !== undefined ? (
        <IssuerContractDetail contractId={contractId} nav={nav} />
      ) : (
        <>
          <PageTitle
            title={t('issuer.contracts.title')}
            description={t('issuer.contracts.description')}
          />
          <IssuerContractList onOpen={nav.toContract} />
        </>
      )}
    </ContractApiContext.Provider>
  );
}
