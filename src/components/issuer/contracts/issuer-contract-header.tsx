import { ArrowLeftIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@/components/common/page-title';
import { ContractStatusBadge } from '@/components/contract/contract-status-badge';
import { contractNumber } from '@/components/contract/format';
import { Button } from '@/components/ui/button';
import type { ContractType } from '@/queries/contract/type';

/** A contract's number and status, its bond and date, and the way back to the list. */
export function IssuerContractHeader({
  contract,
  onBack,
}: {
  contract: ContractType;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 self-start rounded-lg text-muted-foreground"
        onClick={onBack}
      >
        <ArrowLeftIcon />
        {t('issuer.contracts.toList')}
      </Button>
      <PageTitle
        title={t('issuer.contracts.heading', { no: contractNumber(contract) })}
        description={t('issuer.contracts.subheading', {
          code: contract.contract_prefix,
          date: contract.contract_date,
        })}
        action={<ContractStatusBadge status={contract.status} />}
      />
    </div>
  );
}
