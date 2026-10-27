import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import type { ContractType } from '@/queries/contract/type';
import { PartyStatuses } from './party-statuses';
import { SignedContractHeader } from './signed-contract-header';
import { SignedContractPdf } from './signed-contract-pdf';
import { SignedFacts } from './signed-facts';

/**
 * A signed contract: what it says at a glance, with the way back and the download beside
 * the title, its parties, then the signed PDF itself, which the download saves.
 */
export function SignedContract({
  contract,
  onList,
}: {
  contract: ContractType;
  onList: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent className="gap-5">
        <SignedContractHeader contract={contract} onList={onList} />
        <SignedFacts contract={contract} />
        <PartyStatuses contract={contract} className="max-w-none" />
        <section
          aria-label={t('contract.signed.original')}
          className="space-y-2"
        >
          <h3 className="text-sm font-medium text-muted-foreground">
            {t('contract.signed.original')}
          </h3>
          <SignedContractPdf contractId={contract.id} />
        </section>
      </CardContent>
    </Card>
  );
}
