import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { PageTitle } from '@/components/common/page-title';
import { ContractList } from '@/components/contract/list/contract-list';
import { StoredContract } from '@/components/contract/page/stored-contract';
import { useIssuerContractNav } from '@/components/issuer/contracts/use-issuer-contract-nav';
import { ContractApiContext, issuerContractApi } from '@/queries/contract/api';

/**
 * The contracts the signed-in member signs as their bond issuer's director, once every
 * client party has signed: the list, or one contract (contractId), which they read and
 * sign from here (sign) while it waits for them.
 */
const searchSchema = z.object({
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
        <StoredContract contractId={contractId} nav={nav} />
      ) : (
        <>
          <PageTitle
            title={t('issuer.contracts.title')}
            description={t('issuer.contracts.description')}
          />
          <ContractList
            title={t('issuer.contracts.list')}
            emptyText={t('issuer.contracts.empty')}
            onOpen={nav.toContract}
          />
        </>
      )}
    </ContractApiContext.Provider>
  );
}
