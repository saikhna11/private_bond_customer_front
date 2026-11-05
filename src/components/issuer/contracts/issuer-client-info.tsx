import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContractType } from '@/queries/contract/type';
import { IssuerClientPerson } from './issuer-client-person';
import { IssuerRepaymentAccount } from './issuer-repayment-account';

/** The contract's client: its holder, a joint one's co-holder, and the repayment account. */
export function IssuerClientInfo({ contract }: { contract: ContractType }) {
  const { t } = useTranslation();
  const clients = contract.parties.filter(
    (p) => p.type === 'holder' || p.type === 'co_holder',
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('issuer.contracts.client.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {clients.map((p) => (
          <IssuerClientPerson key={p.id} party={p} />
        ))}
        <IssuerRepaymentAccount contract={contract} />
      </CardContent>
    </Card>
  );
}
