import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DeclineButton } from '@/components/contract/decline-button';
import { ContractPreview } from '@/components/contract/preview/contract-preview';
import { ToSignButton } from '@/components/contract/preview/to-sign-button';
import { SignStep } from '@/components/contract/sign/sign-step';
import {
  contractKeys,
  contractPreviewOptions,
  yourParty,
} from '@/queries/contract/options';
import { signContract } from '@/queries/contract/query';
import type { ContractType } from '@/queries/contract/type';
import { CoSignIntro } from './co-sign-intro';
import { ContractFailed } from './contract-failed';
import { ContractLoading } from './contract-loading';
import { ContractSection } from './contract-section';
import { contractsRoute } from './route';

/**
 * A stored contract waiting for the client's own signature: they read the document with
 * the other parties' signatures in place, then sign their own party, or decline it.
 */
export function CoSignSteps({ contract }: { contract: ContractType }) {
  const { sign } = contractsRoute.useSearch();
  const navigate = contractsRoute.useNavigate();
  const queryClient = useQueryClient();
  const {
    data: preview,
    isPending,
    error,
  } = useQuery(contractPreviewOptions(contract.id));
  const you = yourParty(contract);
  const back = () => navigate({ search: { contractId: contract.id } });

  if (isPending) {
    return <ContractLoading />;
  }
  if (error) {
    return <ContractFailed error={error} />;
  }
  const signer = preview.parties.find((p) => p.position === you?.position);
  if (sign && signer) {
    const waiting = new Set(
      contract.parties
        .filter((p) => p.signs && !p.signed_at && p.id !== you?.id)
        .map((p) => p.position),
    );
    return (
      <ContractSection step="sign">
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
      </ContractSection>
    );
  }
  return (
    <ContractSection step="view">
      <CoSignIntro contract={contract} />
      <ContractPreview preview={preview} />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <DeclineButton contractId={contract.id} signed={false} />
        <ToSignButton
          onClick={() =>
            navigate({ search: { contractId: contract.id, sign: true } })
          }
        />
      </div>
    </ContractSection>
  );
}
