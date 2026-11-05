import { useTranslation } from 'react-i18next';
import { SignedContractPdf } from '@/components/contract/done/signed-contract-pdf';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ContractType } from '@/queries/contract/type';
import { IssuerPreviewCard } from './issuer-preview-card';

/**
 * The contract's document: a preview with its clients' signatures while it awaits the
 * director, and the signed PDF once rendered. A contract rendering, failed or ended shows
 * none: where it stands says why.
 */
export function IssuerContractDocument({
  contract,
}: {
  contract: ContractType;
}) {
  const { t } = useTranslation();
  if (contract.status === 'pending_issuer_signature') {
    return <IssuerPreviewCard contractId={contract.id} />;
  }
  if (contract.status !== 'signed') {
    return null;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('contract.signed.original')}</CardTitle>
        <CardDescription>{t('contract.signed.text')}</CardDescription>
      </CardHeader>
      <CardContent>
        <SignedContractPdf contractId={contract.id} />
      </CardContent>
    </Card>
  );
}
