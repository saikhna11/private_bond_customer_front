import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/common/page-title';
import { contractNumber } from '@/components/contract/format';
import { ContractFailed } from '@/components/contract/page/contract-failed';
import { ContractLoading } from '@/components/contract/page/contract-loading';
import type { ContractNav } from '@/components/contract/page/contract-nav';
import { SignStep } from '@/components/contract/sign/sign-step';
import { useContractApi } from '@/queries/contract/api';
import {
  contractPreviewOptions,
  storedKeys,
  yourParty,
} from '@/queries/contract/options';
import type { ContractType } from '@/queries/contract/type';
import { issuerMeOptions } from '@/queries/issuer/options';

/**
 * The director signs the contract here, in their own name: whoever is director now signs
 * it, even one that names a director since replaced, whose names the signed document then
 * gives way to theirs.
 */
export function IssuerSignStep({
  contract,
  nav,
}: {
  contract: ContractType;
  nav: ContractNav;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const api = useContractApi();
  const { data: me } = useSuspenseQuery(issuerMeOptions());
  const {
    data: preview,
    isPending,
    error,
  } = useQuery(contractPreviewOptions(contract.id, api));
  const back = () => nav.toContract(contract.id);

  if (isPending) {
    return <ContractLoading />;
  }
  if (error) {
    return <ContractFailed error={error} onBack={back} />;
  }
  const party = preview.parties.find(
    (p) => p.position === yourParty(contract)?.position,
  );
  if (!party) {
    return (
      <ContractFailed message={t('contract.document.failed')} onBack={back} />
    );
  }
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <PageTitle
        title={t('issuer.contracts.sign.title')}
        description={t('issuer.contracts.sign.description', {
          no: contractNumber(contract),
        })}
      />
      <SignStep
        signer={{
          ...party,
          last_name: me.member.last_name,
          first_name: me.member.first_name,
        }}
        others={[]}
        submit={(signature) => api.signContract(contract.id, signature)}
        onBack={back}
        onSigned={back}
        onConflict={() => {
          // The contract no longer waits for this signature: show where it stands.
          queryClient.invalidateQueries({
            queryKey: storedKeys(api).detail(contract.id),
          });
          back();
        }}
      />
    </div>
  );
}
